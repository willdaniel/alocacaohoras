import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../repositories/db.js";
import crypto from 'crypto';
import { sendResetPasswordEmail, sendPasswordChangedEmail } from './reset_password.js';

const SECRET = process.env.SECRET;

class AuthService {
  async login(email, senha) {
    try {
      const query = `
        SELECT 
          u.id AS usuario_id, 
          u.senha,
          u.acesso,
          c.nome,
          c.email_interno,
          p.nome AS role,
          c.disciplina_id
        FROM usuarios u 
        INNER JOIN colaboradores c ON u.colaborador_id = c.id
        LEFT JOIN permissoes p ON u.permissao_id = p.id
        WHERE c.email_interno = $1
      `;
      const { rows } = await db.query(query, [email]);
      const user = rows[0];

      // Log para verificar se o usuário foi encontrado
      console.log('User found:', !!user);

      // Se o usuário não existe, lança o erro genérico.
      if (!user) {
        throw new Error("Email ou Senha Incorretos"); 
      }

      const isPasswordValid = await bcrypt.compare(senha, user.senha);
      // Log para verificar se a senha é válida
      console.log('Is password valid:', isPasswordValid);

      // Se a senha é inválida, lança o MESMO erro genérico.
      if (!isPasswordValid) {
        throw new Error("Email ou Senha Incorretos");
      }
      
      // Log para verificar o status do acesso do usuário
      console.log('User access:', user.acesso);

      // Se o acesso for restrito, lança um erro ESPECÍFICO para ele.
      if (!user.acesso) {
        // Isso precisa ser um erro diferente para o controller identificar.
        throw new Error("Seu acesso está restrito. Contate o administrador.");
      }
      
      delete user.senha;

      const token = jwt.sign(
        { userId: user.usuario_id, email: user.email_interno, role: user.role, nome: user.nome, disciplinaId: user.disciplina_id },
        SECRET,
        { expiresIn: "8h" }
      );

      return { token, user };

    } catch (error) {
      // Apenas relança o erro para o controller tratar.
      throw error;
    }
  }

  // Função para obter detalhes do usuário logado
  async getUserDetails(userId) {
    try {
      const query = `
        SELECT 
          u.id AS usuario_id, 
          c.nome, 
          c.email_interno, 
          p.nome AS role,
          c.disciplina_id,
          u.acesso, 
          u.criado_em
        FROM usuarios u
        INNER JOIN colaboradores c ON u.colaborador_id = c.id
        LEFT JOIN permissoes p ON u.permissao_id = p.id
        WHERE u.id = $1
      `;
      const { rows } = await db.query(query, [userId]);
      const user = rows[0];

      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      return user;
      
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async forgotPassword(email) {
    try {
      const userResult = await db.query('SELECT u.id, c.email_interno FROM usuarios u JOIN colaboradores c ON u.colaborador_id = c.id WHERE c.email_interno = $1 AND u.acesso = true', [email]);
      const user = userResult.rows[0];

      if (!user) {
        console.log(`Solicitação de redefinição de senha para email não existente ou inativo: ${email}`);
        return { message: 'Se o e-mail estiver registrado e ativo, um link de redefinição será enviado.' };
      }

      // Gera um token de redefinição
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpires = new Date(Date.now() + 3600000); // Expira em 1 hora

      // Armazena o token e sua data de expiração no banco de dados
      await db.query(
        'UPDATE usuarios SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3',
        [resetToken, resetTokenExpires, user.id]
      );

      // Envia o e-mail com o link de redefinição
      await sendResetPasswordEmail(user.email_interno, resetToken);

      return { message: 'Se o e-mail estiver registrado e ativo, um link de redefinição será enviado.' };
    } catch (error) {
      console.error('Erro no serviço forgotPassword:', error);
      // Não expor o erro original para o usuário, para evitar vazamento de detalhes de implementação.
      throw new Error('Erro ao processar a solicitação de redefinição de senha.');
    }
  }

  async resetPassword(token, newPassword) {
    try {
      // 1. Find the user by the reset token and check expiration
      const userResult = await db.query(
        'SELECT u.id, c.email_interno FROM usuarios u JOIN colaboradores c ON u.colaborador_id = c.id WHERE reset_password_token = $1 AND reset_password_expires > NOW()',
        [token]
      );
      const user = userResult.rows[0];

      if (!user) {
        throw new Error('Token de redefinição de senha inválido ou expirado.');
      }

      // 2. Hash the new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // 3. Update the user's password and clear the reset token fields
      await db.query(
        'UPDATE usuarios SET senha = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2',
        [hashedPassword, user.id]
      );

      // Send password changed notification email
      await sendPasswordChangedEmail(user.email_interno);

      return { message: 'Senha alterada com sucesso.' };

    } catch (error) {
      console.error('Erro no serviço resetPassword:', error);
      // Re-throw specific error messages for the controller to handle
      if (error.message === 'Token de redefinição de senha inválido ou expirado.') {
        throw error;
      }
      throw new Error('Erro ao redefinir a senha.');
    }
  }
}

export default AuthService;
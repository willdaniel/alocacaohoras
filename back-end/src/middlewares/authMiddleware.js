import { verifyToken } from "../utils/jwt.js";
import db from "../repositories/db.js"; 

const authMiddleware = async (req, res, next) => { 
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não fornecido ou mal formatado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    console.log('Decoded token:', decoded);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Token inválido: não foi possível decodificar o ID do usuário." });
    }

    const query = `
      SELECT
        u.id,
        c.nome,
        p.nome as role_name,
        c.disciplina_id as user_disciplina_id
      FROM usuarios u
      JOIN permissoes p ON u.permissao_id = p.id
      JOIN colaboradores c ON u.colaborador_id = c.id
      WHERE u.id = $1 AND u.acesso = true
    `;
    const { rows } = await db.query(query, [decoded.userId]);
    const user = rows[0];
    console.log('User from DB:', user);

    if (!user || !user.role_name) {
      return res.status(403).json({ message: "Acesso não autorizado." });
    }

    req.user = {
      ...decoded,
      nome: user.nome,
      role: user.role_name,
      disciplinaId: user.user_disciplina_id
    }; 
    next();
    
  } catch (error) {
    console.error("Erro ao verificar o token:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expirado" });
    }

    return res.status(401).json({ message: "Token inválido" });
  }
};

export default authMiddleware;
import bcrypt from "bcrypt";
import CadastroRepository from '../repositories/CadastroRepository.js';
import db from '../repositories/db.js';

class UsuariosService {
  constructor() {
    this.repository = new CadastroRepository('usuarios', ['id', 'colaborador_id', 'permissao_id', 'senha', 'acesso']);
    this.colaboradoresRepository = new CadastroRepository('colaboradores', ['id', 'nome', 'disciplina_id']);
    this.permissoesRepository = new CadastroRepository('permissoes', ['id', 'nome']);
  }
  
  async getAll() {
    try {
      const query = `
        SELECT 
          u.id,
          c.nome AS colaborador,
          p.nome AS permissao,
          d.nome AS disciplina,
          u.acesso
        FROM usuarios u
        JOIN colaboradores c ON u.colaborador_id = c.id
        JOIN permissoes p ON u.permissao_id = p.id
        LEFT JOIN disciplinas d ON c.disciplina_id = d.id
      `;
      const { rows } = await db.query(query);
      return rows;
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      throw new Error('Erro ao buscar usuários');
    }
  }

  async getById(id) {
    try {
      const query = `
        SELECT 
          u.id,
          c.nome AS colaborador,
          p.nome AS permissao,
          d.nome AS disciplina,
          u.acesso,
          u.colaborador_id,
          u.permissao_id,
          c.disciplina_id AS disciplina_id_colaborador
        FROM usuarios u
        JOIN colaboradores c ON u.colaborador_id = c.id
        JOIN permissoes p ON u.permissao_id = p.id
        LEFT JOIN disciplinas d ON c.disciplina_id = d.id
        WHERE u.id = $1
      `;
      const { rows } = await db.query(query, [id]);
      if (rows.length > 0) {
        return rows[0];
      } else {
        throw new Error("Usuário não encontrado");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async create(data) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      if (data.colaborador_id && data.disciplina_id) {
        await client.query('UPDATE colaboradores SET disciplina_id = $1 WHERE id = $2', [data.disciplina_id, data.colaborador_id]);
      }

      if (data.senha) {
        const saltRounds = 10;
        data.senha = await bcrypt.hash(data.senha, saltRounds);
      }
      
      const valuesArray = [data.colaborador_id, data.permissao_id, data.senha, data.acesso];
      const newUser = await this.repository.insertOne(valuesArray, client);
      
      await client.query('COMMIT');
      return newUser;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error("Erro no UsuariosService.create:", error);
      throw new Error("Erro ao criar usuário");
    } finally {
      client.release();
    }
  }

  async update(id, data) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      let colaboradorId = data.colaborador_id;
      if (data.disciplina_id !== undefined) {
        if (!colaboradorId) {
            const { rows } = await client.query('SELECT colaborador_id FROM usuarios WHERE id = $1', [id]);
            if (rows.length > 0) {
              colaboradorId = rows[0].colaborador_id;
            }
        }
        if(colaboradorId) {
            await client.query('UPDATE colaboradores SET disciplina_id = $1 WHERE id = $2', [data.disciplina_id, colaboradorId]);
        }
      }

      const fieldsToUpdate = {};
      if (data.colaborador_id !== undefined) fieldsToUpdate.colaborador_id = data.colaborador_id;
      if (data.permissao_id !== undefined) fieldsToUpdate.permissao_id = data.permissao_id;
      if (data.acesso !== undefined) fieldsToUpdate.acesso = Boolean(data.acesso);

      if (data.senha && data.senha.length > 0) {
        const saltRounds = 10;
        fieldsToUpdate.senha = await bcrypt.hash(data.senha, saltRounds);
      }

      if (Object.keys(fieldsToUpdate).length > 0) {
        await this.repository.updateByID(id, fieldsToUpdate, client);
      } else if (data.disciplina_id === undefined) {
        // Se não há campos para atualizar no usuário e também não há disciplina_id, não faz nada.
        return { message: "Nenhum dado para atualizar." };
      }

      await client.query('COMMIT');
      return { message: "Usuário atualizado com sucesso." };

    } catch (error) {
      await client.query('ROLLBACK');
      console.error("Erro no UsuariosService.update:", error.message);
      throw new Error(error.message);
    } finally {
      client.release();
    }
  }

  async delete(id) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      await this.repository.deleteByID(id, client);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(error.message);
    } finally {
      client.release();
    }
  }

  async getManagers(user) {
    try {
      let query = `
        SELECT
          u.id,
          c.nome
        FROM usuarios u
        JOIN colaboradores c ON u.colaborador_id = c.id
        JOIN permissoes p ON u.permissao_id = p.id
        WHERE p.nome = 'lider'
      `;
      const params = [];

      const { rows } = await db.query(query, params);
      return rows;
    } catch (error) {
      console.error("Erro ao buscar gestores:", error);
      throw new Error('Erro ao buscar gestores');
    }
  }
}

export default new UsuariosService();

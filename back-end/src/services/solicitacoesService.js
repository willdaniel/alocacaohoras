import db from '../repositories/db.js';

class SolicitacoesService {
  async create(data) {
    const { tipo, startDate, endDate, userId, managerId } = data;
    try {
      const query = `
        INSERT INTO solicitacoes (tipo, data_inicio, data_fim, solicitante_id, gestor_id, status)
        VALUES ($1, $2, $3, $4, $5, 'aguardando')
        RETURNING *;
      `;
      const values = [tipo, startDate, endDate, userId, managerId];
      const { rows } = await db.query(query, values);

      // Create a notification for the manager
      const notificationQuery = `
        INSERT INTO notificacoes (usuario_id, tipo, mensagem, link)
        VALUES ($1, 'solicitacao', 'Nova solicitação de ${tipo}', '/solicitacoes')
      `;
      await db.query(notificationQuery, [managerId]);

      return rows[0];
    } catch (error) {
      console.error("Erro ao criar solicitação:", error);
      throw new Error('Erro ao criar solicitação');
    }
  }

  async getByUserId(userId) {
    try {
      const query = `
        SELECT
          id,
          tipo,
          data_solicitacao,
          data_inicio,
          data_fim,
          status
        FROM solicitacoes
        WHERE solicitante_id = $1
        ORDER BY data_solicitacao DESC;
      `;
      const { rows } = await db.query(query, [userId]);
      return rows;
    } catch (error) {
      console.error("Erro ao buscar solicitações por usuário:", error);
      throw new Error('Erro ao buscar solicitações');
    }
  }

  async getByManagerId(managerId) {
    try {
      const query = `
        SELECT
          s.id,
          s.tipo,
          s.data_solicitacao,
          s.data_inicio,
          s.data_fim,
          s.status,
          c.nome as solicitante_nome
        FROM solicitacoes s
        JOIN usuarios u ON s.solicitante_id = u.id
        JOIN colaboradores c ON u.colaborador_id = c.id
        WHERE s.gestor_id = $1
        ORDER BY s.data_solicitacao DESC;
      `;
      const { rows } = await db.query(query, [managerId]);
      return rows;
    } catch (error) {
      console.error("Erro ao buscar solicitações por gestor:", error);
      throw new Error('Erro ao buscar solicitações');
    }
  }

  async getRetroactivePermission(userId) {
    try {
      const query = `
        SELECT data_inicio, data_fim
        FROM solicitacoes
        WHERE solicitante_id = $1
          AND tipo = 'Lançar horas retroativas'
          AND status = 'aprovado'
          AND aprovado_em IS NOT NULL
          AND NOW() <= aprovado_em + INTERVAL '24 hours'
        ORDER BY aprovado_em DESC;
      `;
      const { rows } = await db.query(query, [userId]);
      return rows;
    } catch (error) {
      console.error("Erro ao buscar permissão retroativa:", error);
      throw new Error('Erro ao buscar permissão retroativa');
    }
  }

  async updateStatus(id, status) {
    try {
      await db.query('BEGIN');

      const solicitacaoInfo = await db.query('SELECT tipo FROM solicitacoes WHERE id = $1', [id]);
      if (solicitacaoInfo.rows.length === 0) {
        throw new Error('Solicitação não encontrada.');
      }
      const solicitacaoTipo = solicitacaoInfo.rows[0].tipo;

      let updateQuery;
      const queryParams = [status, id];

      if (status === 'aprovado' && solicitacaoTipo === 'Lançar horas retroativas') {
        updateQuery = `UPDATE solicitacoes SET status = $1, aprovado_em = NOW() WHERE id = $2 RETURNING solicitante_id, tipo`;
      } else {
        updateQuery = `UPDATE solicitacoes SET status = $1 WHERE id = $2 RETURNING solicitante_id, tipo`;
      }
      
      const { rows } = await db.query(updateQuery, queryParams);

      if (rows.length === 0) {
        throw new Error('Solicitação não encontrada.');
      }

      const { solicitante_id, tipo } = rows[0];
      const mensagem = `Sua solicitação de "${tipo}" foi ${status}.`;

      const notificationQuery = `INSERT INTO notificacoes (usuario_id, tipo, mensagem, link) VALUES ($1, 'solicitacao_resposta', $2, '/solicitacoes')`;
      await db.query(notificationQuery, [solicitante_id, mensagem]);

      await db.query('COMMIT');
    } catch (error) {
      await db.query('ROLLBACK');
      console.error("Erro ao atualizar status da solicitação:", error);
      throw new Error('Erro ao atualizar status da solicitação');
    }
  }

  async delete(id) {
    try {
      const result = await db.query('DELETE FROM solicitacoes WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        throw new Error('Solicitação não encontrada.');
      }
    } catch (error) {
      console.error("Erro ao deletar solicitação:", error);
      throw new Error('Erro ao deletar solicitação');
    }
  }
}

export default SolicitacoesService;
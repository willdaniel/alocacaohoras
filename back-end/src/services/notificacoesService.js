import db from '../repositories/db.js';
import UsuariosRepository from '../repositories/UsuariosRepository.js';

const usuariosRepository = new UsuariosRepository();

class NotificacoesService {
  async getByUserId(userId) {
    try {
      const query = `
        SELECT * FROM notificacoes
        WHERE usuario_id = $1 AND lida = false ORDER BY data_criacao DESC
      `;
      const { rows } = await db.query(query, [userId]);
      return rows;
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      throw new Error('Erro ao buscar notificações');
    }
  }

  async create(notification) {
    const { usuario_id, mensagem, tipo, link } = notification;
    const query = `
      INSERT INTO notificacoes (usuario_id, mensagem, lida, tipo, link)
      VALUES ($1, $2, false, $3, $4)
      RETURNING *;
    `;
    try {
      const { rows } = await db.query(query, [usuario_id, mensagem, tipo || 'geral', link]);
      return rows[0];
    } catch (error) {
      console.error("Erro ao criar notificação:", error);
      throw new Error('Erro ao criar notificação');
    }
  }

  async markAsRead(notificationId) {
    try {
      const query = `
        UPDATE notificacoes
        SET lida = true
        WHERE id = $1
      `;
      await db.query(query, [notificationId]);
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
      throw new Error('Erro ao marcar notificação como lida');
    }
  }

  async sendNotificationToAllUsers(mensagem, tipo, link) {
    try {
      const userIds = await usuariosRepository.getAllUserIds();
      for (const userId of userIds) {
        await this.create({ usuario_id: userId, mensagem, tipo, link });
      }
    } catch (error) {
      console.error("Erro ao enviar notificação para todos os usuários:", error);
      throw new Error('Erro ao enviar notificação para todos os usuários');
    }
  }
}

export default NotificacoesService;
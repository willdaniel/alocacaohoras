import SolicitacoesService from '../services/solicitacoesService.js';

const solicitacoesService = new SolicitacoesService();

class SolicitacoesController {
  async create(req, res) {
    try {
      const { tipo, dateRange, managerId } = req.body;
      const userId = req.user.userId;
      const [startDate, endDate] = dateRange;

      const result = await solicitacoesService.create({
        tipo,
        startDate,
        endDate,
        userId,
        managerId,
      });
      res.status(201).json({ message: "Solicitação criada com sucesso", result });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getByUserId(req, res) {
    try {
      const userId = req.user.userId;
      const solicitacoes = await solicitacoesService.getByUserId(userId);
      res.status(200).json(solicitacoes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getByManagerId(req, res) {
    try {
      const managerId = req.user.userId;
      const solicitacoes = await solicitacoesService.getByManagerId(managerId);
      res.status(200).json(solicitacoes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getRetroactivePermission(req, res) {
    try {
      const userId = req.user.userId;
      const permissions = await solicitacoesService.getRetroactivePermission(userId);
      res.status(200).json(permissions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body; // 'aprovado' or 'negado'
      if (!['aprovado', 'negado'].includes(status)) {
        return res.status(400).json({ message: 'Status inválido.' });
      }
      await solicitacoesService.updateStatus(id, status);
      res.status(200).json({ message: `Solicitação ${status} com sucesso.` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await solicitacoesService.delete(id);
      res.status(200).json({ message: 'Solicitação deletada com sucesso.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new SolicitacoesController();
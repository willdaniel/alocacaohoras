import IntegracoesService from "../services/integracoesService.js";

class IntegracoesController {
  constructor() {
    this.service = new IntegracoesService();
  }

  getAll = async (req, res) => {
    try {
      const result = await this.service.getAll();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar dados', error: error.message });
    }
  };

  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.service.getById(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  create = async (req, res) => {
    try {
      const usuarioId = req.user.userId; // Obtém do token
      const result = await this.service.create(req.body, usuarioId);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar registro', error: error.message });
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const usuarioId = req.user.userId;
      const result = await this.service.update(id, req.body, usuarioId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar registro', error: error.message });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      res.status(200).json({ message: 'Registro excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir registro', error: error.message });
    }
  };
}

export default IntegracoesController;

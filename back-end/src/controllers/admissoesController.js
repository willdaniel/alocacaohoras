import AdmissoesService from "../services/admissoesService.js";

class AdmissoesController {
  constructor() {
    this.service = new AdmissoesService();
  }

  getAll = async (req, res) => {
    try {
      const result = await this.service.getAll();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
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
      const userId = req.user.userId; // Captura do authMiddleware
      const result = await this.service.create(req.body, userId);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.service.update(id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      res.status(200).json({ message: 'Registro excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}

export default AdmissoesController;

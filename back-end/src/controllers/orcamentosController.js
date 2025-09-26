import OrcamentosService from '../services/orcamentosService.js';

class OrcamentosController {
  static async getAll(req, res) {
    try {
      const orcamentos = await OrcamentosService.getAll();
      res.status(200).json(orcamentos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default OrcamentosController;

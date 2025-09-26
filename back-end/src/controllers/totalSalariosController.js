import TotalSalariosService from "../services/totalSalariosService.js";

class TotalSalariosController {
  constructor() {
    this.service = new TotalSalariosService();
  }

  getAll = async (req, res) => {
    try {
      const result = await this.service.getAll();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar dados', error });
    }
  };
}

export default TotalSalariosController;

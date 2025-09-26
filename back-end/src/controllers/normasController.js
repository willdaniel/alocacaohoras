import NormasService from "../services/normasService.js";

class NormasController {
  constructor() {
    this.service = new NormasService();
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

export default NormasController;

import AniversariantesService from '../services/aniversariantesService.js';

class AniversariantesController {
  constructor() {
    this.service = new AniversariantesService();
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

export default AniversariantesController;

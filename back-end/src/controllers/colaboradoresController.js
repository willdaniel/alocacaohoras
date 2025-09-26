import ColaboradoresService from '../services/colaboradoresService.js';

class ColaboradoresController {
  constructor() {
    this.service = new ColaboradoresService();
  }

  // Using arrow functions to automatically bind `this`
  getAllActives = async (req, res) => {
    try {
      const colaboradores = await this.service.getAllActives();
      res.status(200).json(colaboradores);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar colaboradores ativos: ' + error.message });
    }
  };

  getAllInactives = async (req, res) => {
    try {
      const colaboradores = await this.service.getAllInactives();
      res.status(200).json(colaboradores);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar colaboradores inativos: ' + error.message });
    }
  };

  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const colaborador = await this.service.getByIdComFormatacao(id);
      if (colaborador) {
        res.status(200).json(colaborador);
      } else {
        res.status(404).json({ message: 'Colaborador não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar colaborador: ' + error.message });
    }
  };

  create = async (req, res) => {
    try {
      const novoColaborador = await this.service.create(req.body);
      res.status(201).json(novoColaborador);
    } catch (error) {
      res.status(400).json({ message: 'Erro ao criar colaborador: ' + error.message });
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const colaboradorAtualizado = await this.service.update(id, req.body);
      res.status(200).json(colaboradorAtualizado);
    } catch (error) {
      res.status(400).json({ message: 'Erro ao atualizar colaborador: ' + error.message });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      res.status(204).send(); // No Content
    } catch (error) {
      res.status(500).json({ message: 'Erro ao deletar colaborador: ' + error.message });
    }
  };

  markAsInactive = async (req, res) => {
    try {
      const { id } = req.params;
      await this.service.markAsInactive(id);
      res.status(200).json({ message: 'Colaborador marcado como inativo com sucesso.' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao marcar colaborador como inativo: ' + error.message });
    }
  };

  getTeam = async (req, res) => {
    try {
      const team = await this.service.getTeam(req.user);
      res.status(200).json(team);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar time: ' + error.message });
    }
  };
}

// Export an INSTANCE of the controller, making its methods available.
export default new ColaboradoresController();
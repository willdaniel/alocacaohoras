import CadastroRepository from '../repositories/CadastroRepository.js';

class CadastroController {
  constructor(tabela, columns) {
    this.repository = new CadastroRepository(tabela, columns);
  }

  getAll = async (req, res) => {
    try {
      const result = await this.repository.getAll();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar registros', error });
    }
  };

  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.repository.getByID(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar registro', error });
    }
  };

  create = async (req, res) => {
    try {
      const valuesArray = Object.values(req.body);
      const result = await this.repository.insertOne(valuesArray);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar registro', error });
    }
  };

    update = async (req, res) => {
    try {
      const { id } = req.params;
      const fieldsToUpdate = req.body;
      const result = await this.repository.updateByID(id, fieldsToUpdate);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar registro', error });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      await this.repository.deleteByID(id);
      res.status(200).json({ message: 'Registro excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir registro', error });
    }
  };
}

export default CadastroController;

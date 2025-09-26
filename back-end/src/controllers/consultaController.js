import CadastroRepository from '../repositories/CadastroRepository.js';

class ConsultaController {
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
}

export default ConsultaController;

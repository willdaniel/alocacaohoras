import CadastroRepository from '../repositories/CadastroRepository.js';
import { formatDate, sortByNearestDate } from '../utils/dateUtils.js';

class IntegracoesService {
  constructor() {
    this.repository = new CadastroRepository(
      'integracoes',
      ['id', 'colaborador_id', 'cliente_id', 'data_integracao']
    );
    this.colaboradoresRepository = new CadastroRepository('colaboradores', ['id', 'nome']);
    this.clientesRepository = new CadastroRepository('clientes', ['id', 'nome']);
  }

  async getAll() {
    try {
      const results = await this.repository.getAll();
      const colaboradores = await this.colaboradoresRepository.getAll();
      const clientes = await this.clientesRepository.getAll();

      const getColaboradorNome = (id) =>
        colaboradores.find((c) => c.id === id)?.nome || 'Não encontrado';

      const getClienteNome = (id) =>
        clientes.find((c) => c.id === id)?.nome || 'Não encontrado';


      // If you don't need sorting, use results directly:
      const items = results;

      return items.map((item) => ({
        id: item.id,
        colaborador: getColaboradorNome(item.colaborador_id),
        cliente: getClienteNome(item.cliente_id),
        data_integracao: formatDate(item.data_integracao, 'DD/MM/YYYY')
      }));
    } catch (error) {
      console.error('Erro real ao buscar dados:', error);
      throw new Error('Erro ao buscar dados');
    }
  }

  async getById(id) {
    try {
      const result = await this.repository.getByID(id);

      return {
        ...result,
        data_integracao: formatDate(result.data_integracao, 'YYYY-MM-DD')
      };
    } catch (error) {
      throw new Error('Erro ao buscar registro');
    }
  }
  

  async create(data) {
    try {
      const valuesArray = Object.values(data);
      return await this.repository.insertOne(valuesArray);
    } catch (error) {
      throw new Error("Erro ao criar usuário");
    }
  }

  async update(id, data) {
    try {
      const valuesArray = Object.values(data);
      return await this.repository.updateByID(valuesArray, id);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async delete(id) {
    try {
      return await this.repository.deleteByID(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default IntegracoesService;

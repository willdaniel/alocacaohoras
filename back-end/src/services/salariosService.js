import CadastroRepository from '../repositories/CadastroRepository.js';
import { formatDate } from '../utils/dateUtils.js';

class SalariosService {
  constructor() {
    this.insertColumns = ['colaborador_id', 'valor', 'data_inicio', 'observacao', 'usuario_id', 'criado_em'];
    this.repository = new CadastroRepository('salarios', ['id', ...this.insertColumns]);
    this.colaboradoresRepository = new CadastroRepository('colaboradores', ['id', 'nome']);
  }

  async getAll() {
    try {
      const salarios = await this.repository.getAll();
      const colaboradores = await this.colaboradoresRepository.getAll();

      const getColaboradorNome = (id) =>
        colaboradores.find((c) => c.id === id)?.nome || 'Não encontrado';

      return salarios.map((item) => ({
        ...item,
        colaborador: getColaboradorNome(item.colaborador_id),
        data_inicio: formatDate(item.data_inicio, 'DD/MM/YYYY')
      }));
    } catch (error) {
      console.error('Erro em SalariosService.getAll:', error);
      throw new Error('Erro ao buscar dados');
    }
  }

  async getById(id) {
    try {
      const result = await this.repository.getByID(id);
      if (!result) {
        throw new Error('Registro não encontrado');
      }
      return {
        ...result,
        data_inicio: formatDate(result.data_inicio, 'YYYY-MM-DD')
      };
    } catch (error) {
      console.error('Erro em SalariosService.getById:', error);
      throw new Error('Erro ao buscar registro');
    }
  }

  async create(data, userId) {
    try {
      if (!userId || typeof userId !== 'number') {
        console.error('ID de usuário inválido recebido no serviço:', userId);
        throw new Error('Não foi possível identificar o usuário autenticado para criar o registro.');
      }

      const { colaborador_id, valor, data_inicio, observacao } = data;

      if (!colaborador_id || typeof colaborador_id !== 'number') {
        throw new Error('ID do colaborador é inválido ou não foi fornecido.');
      }

      const colaboradorExistente = await this.colaboradoresRepository.getByID(colaborador_id);
      if (!colaboradorExistente) {
        throw new Error(`Colaborador com ID ${colaborador_id} não foi encontrado.`);
      }

      const payload = {
        colaborador_id,
        valor,
        data_inicio,
        observacao,
        usuario_id: userId,
        criado_em: new Date()
      };

      const valuesArray = this.insertColumns.map(col => payload[col]);
      const result = await this.repository.insertOne(valuesArray);
 
      return result;
    } catch (error) {
      console.error('Erro em SalariosService.create:', error);
      throw new Error(error.message || 'Erro ao criar registro');
    }
  }
  
  async update(id, data, userId) {
    try {
      if (!userId || typeof userId !== 'number') {
        console.error('ID de usuário inválido recebido no serviço:', userId);
        throw new Error('Não foi possível identificar o usuário autenticado para atualizar o registro.');
      }

      const { id: idDoBody, ...dadosRestantes } = data;
      
      const payload = { 
        ...dadosRestantes, 
        usuario_id: userId
      };

      const colunasParaUpdate = ['colaborador_id', 'valor', 'data_inicio', 'observacao', 'usuario_id'];
      const dataToUpdate = {};
      colunasParaUpdate.forEach(key => {
        // Adiciona a chave ao objeto apenas se ela existir no payload
        if (payload[key] !== undefined) {
          dataToUpdate[key] = payload[key];
        }
      });

      // Assumindo que o repositório espera (id, dataObject)
      return await this.repository.updateByID(id, dataToUpdate);

    } catch (error) {
      console.error('Erro em SalariosService.update:', error);
      throw new Error('Erro ao atualizar registro');
    }
  }

  async delete(id) {
    try {
      return await this.repository.deleteByID(id);
    } catch (error) {
      console.error('Erro em SalariosService.delete:', error);
      throw new Error('Erro ao excluir registro');
    }
  }
}

export default SalariosService;

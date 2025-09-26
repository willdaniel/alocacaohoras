import AlocacoesRepository from '../repositories/AlocacoesRepository.js';
import CadastroRepository from '../repositories/CadastroRepository.js';

class AlocacoesService {
  static async getAll(user) {
    return await AlocacoesRepository.getAll(user);
  }

  static async getTop3ByWeek(user) {
    return await AlocacoesRepository.getTop3ByWeek(user);
  }

  static async getHorasProjetoSemana(projeto) {
    return await AlocacoesRepository.getHorasProjetoSemana(projeto);
  }

  static async getTotalMonthlyHours(user) {
    return await AlocacoesRepository.getTotalMonthlyHours(user);
  }

  static async getAllocatedProjectsAndHours(user, disciplina) {
    return await AlocacoesRepository.getAllocatedProjectsAndHours(user, disciplina);
  }

  static async getById(id, user) {
    return await AlocacoesRepository.getById(id, user);
  }

  static async getLastAllocatedHour(user) {
    return await AlocacoesRepository.getLastAllocatedHour(user);
  }

  static async delete(id, user) {
    return await AlocacoesRepository.delete(id, user);
  }

  static async update(id, data, user) {
    if (data.tipo === 'Administrativo' || data.tipo === 'Orçamento') {
      const clienteId = parseInt(data.cliente_id, 10);
      if (isNaN(clienteId)) { // It's a string like "Administrativo", "ASO" or an AX ID
        if (data.cliente_id === 'Administrativo') {
          if (!data.comments || data.comments.trim() === '') {
            throw new Error('Por favor, justifique nos comentários!');
          }
        }
        // For any administrative task that is not a real client,
        // prepend the task name to comments and set cliente_id to null.
        if (data.comments) {
          data.comments = `${data.cliente_id} - ${data.comments}`;
        } else {
          data.comments = data.cliente_id;
        }
        data.cliente_id = null;
      } else { // It's a number
        const clientesRepository = new CadastroRepository('clientes', ['id', 'nome']);
        const cliente = await clientesRepository.getByID(clienteId);
        if (cliente && cliente.nome === 'Administrativo') {
          if (!data.comments || data.comments.trim() === '') {
            throw new Error('Por favor, justifique nos comentários!');
          }
        }
      }
    }
    return await AlocacoesRepository.update(id, data, user);
  }

  static async create(data, user) {
    const { disciplina_id } = data;

    if (!disciplina_id) {
      throw new Error('Disciplina ID é obrigatório para alocação de horas.');
    }

    const disciplinasRepository = new CadastroRepository('disciplinas', ['id', 'nome', 'lider_resp']);
    const disciplina = await disciplinasRepository.getByID(disciplina_id);

    if (!disciplina) {
      throw new Error('Disciplina não encontrada.');
    }

    if (data.tipo === 'Administrativo' || data.tipo === 'Orçamento') {
      const clienteId = parseInt(data.cliente_id, 10);
      if (isNaN(clienteId)) { // It's a string like "Administrativo", "ASO" or an AX ID
        if (data.cliente_id === 'Administrativo') {
          if (!data.comments || data.comments.trim() === '') {
            throw new Error('Por favor, justifique nos comentários!');
          }
        }
        // For any administrative task that is not a real client,
        // prepend the task name to comments and set cliente_id to null.
        if (data.comments) {
          data.comments = `${data.cliente_id} - ${data.comments}`;
        } else {
          data.comments = data.cliente_id;
        }
        data.cliente_id = null;
      } else { // It's a number
        const clientesRepository = new CadastroRepository('clientes', ['id', 'nome']);
        const cliente = await clientesRepository.getByID(clienteId);
        if (cliente && cliente.nome === 'Administrativo') {
          if (!data.comments || data.comments.trim() === '') {
            throw new Error('Por favor, justifique nos comentários!');
          }
        }
      }
    }

    return await AlocacoesRepository.create(data);
  }
}

export default AlocacoesService;

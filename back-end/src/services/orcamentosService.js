import OrcamentosRepository from '../repositories/OrcamentosRepository.js';

class OrcamentosService {
  static async getAll() {
    return await OrcamentosRepository.getAll();
  }
}

export default OrcamentosService;

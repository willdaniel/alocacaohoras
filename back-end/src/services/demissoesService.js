import CadastroRepository from '../repositories/CadastroRepository.js';
import { formatDate } from '../utils/dateUtils.js';

class DemissoesService {
  constructor() {
    this.repository = new CadastroRepository('demissoes', ['id', 'colaborador_id', 'data_demissao', 'motivo_id', 'usuario_id']);
    this.colaboradoresRepository = new CadastroRepository('colaboradores', ['id', 'nome']);
    this.motivosRepository = new CadastroRepository('motivos_demissao', ['id', 'nome']);
    this.usuariosRepository = new CadastroRepository('usuarios', ['id', 'nome']);
  }

  async getAll() {
    try {
      const results = await this.repository.getAll();

      const colaboradores = await this.colaboradoresRepository.getAll();
      const motivos = await this.motivosRepository.getAll();
      const usuarios = await this.usuariosRepository.getAll();

      const getColaboradorNome = (id) =>
        colaboradores.find((c) => c.id === id)?.nome || 'Não encontrado';

      const getMotivoNome = (id) =>
        motivos.find((m) => m.id === id)?.nome || 'Não encontrado';

      const getUsuarioNome = (usuarioId) => {
        const usuario = usuarios.find((u) => u.id === usuarioId);
        if (!usuario) return 'Não encontrado';

        const colaborador = colaboradores.find((c) => c.id === usuario.colaborador_id);
        return colaborador?.nome || 'Não encontrado';
      };
      return results.map((demissao) => ({
        ...demissao,
        colaborador: getColaboradorNome(demissao.colaborador_id),
        motivo: getMotivoNome(demissao.motivo_id),
        cadastrado_por: getUsuarioNome(demissao.usuario_id),
        data_demissao: formatDate(demissao.data_demissao, 'DD/MM/YYYY')
      }));
    } catch (error) {
      throw new Error('Erro ao buscar dados');
    }
  }

  async getById(id) {
    try {
      const result = await this.repository.getByID(id);
      return {
        ...result,
        data_demissao: formatDate(result.data_demissao, 'YYYY-MM-DD')
      };
    } catch (error) {
      throw new Error('Erro ao buscar registro');
    }
  }

  async create(data, usuarioId) {
    try {
      const payload = { ...data, usuario_id: usuarioId };
      const valuesArray = Object.values(payload);
      return await this.repository.insertOne(valuesArray);
    } catch (error) {
      throw new Error('Erro ao criar demissão');
    }
  }

  async update(id, data, usuarioId) {
    try {
      const payload = { ...data, usuario_id: usuarioId };
      const valuesArray = Object.values(payload);
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

export default DemissoesService;

import CadastroRepository from '../repositories/CadastroRepository.js';
import { formatDate } from '../utils/dateUtils.js';

class AdmissoesService {
  constructor() {
    this.repository = new CadastroRepository('admissoes', ['id', 'colaborador_id', 'data_admissao', 'data_renovacao', 'contrato_id', 'usuario_id']);
    this.colaboradoresRepository = new CadastroRepository('colaboradores', ['id', 'nome']);
    this.contratosRepository = new CadastroRepository('contratos', ['id', 'nome']);
    this.usuariosRepository = new CadastroRepository('usuarios', ['id', 'colaborador_id']);
  }

  async getAll() {
    try {
      const results = await this.repository.getAll();
      const colaboradores = await this.colaboradoresRepository.getAll();
      const contratos = await this.contratosRepository.getAll();
      const usuarios = await this.usuariosRepository.getAll();

      const getColaboradorNome = (id) => colaboradores.find((c) => c.id === id)?.nome || 'Não encontrado';
      const getContratoNome = (id) => contratos.find((c) => c.id === id)?.nome || 'Não encontrado';
      const getUsuarioNome = (usuarioId) => {
        const usuario = usuarios.find((u) => u.id === usuarioId);
        if (!usuario) return 'Não encontrado';
        const colaborador = colaboradores.find((c) => c.id === usuario.colaborador_id);
        return colaborador?.nome || 'Não encontrado';
      };

      return results.map((admissao) => ({
        ...admissao,
        colaborador_nome: getColaboradorNome(admissao.colaborador_id), // Renomeado para consistência
        contrato_nome: getContratoNome(admissao.contrato_id),       // Renomeado para consistência
        cadastrado_por: getUsuarioNome(admissao.usuario_id),
        data_admissao: formatDate(admissao.data_admissao, 'DD/MM/YYYY'),
        data_renovacao: formatDate(admissao.data_renovacao, 'DD/MM/YYYY')
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
        data_admissao: formatDate(result.data_admissao, 'YYYY-MM-DD'),
        data_renovacao: formatDate(result.data_renovacao, 'YYYY-MM-DD')
      };
    } catch (error) {
      throw new Error('Erro ao buscar registro');
    }
  }

  async create(data, usuarioId) {
    try {
      // Monta o array de valores na ordem correta para inserção
      const columnsForInsert = ['colaborador_id', 'data_admissao', 'data_renovacao', 'contrato_id', 'usuario_id'];
      const payload = { ...data, usuario_id: usuarioId };
      const valuesArray = columnsForInsert.map(col => payload[col]);
      
      return await this.repository.insertOne(valuesArray);
    } catch (error) {
      throw new Error('Erro ao criar admissão');
    }
  }

  async update(id, data, usuarioId) {
    try {
      const fieldsToUpdate = {};

      // Adiciona os campos ao objeto de atualização apenas se eles existirem nos dados recebidos
      if (data.colaborador_id !== undefined) fieldsToUpdate.colaborador_id = data.colaborador_id;
      if (data.data_admissao !== undefined) fieldsToUpdate.data_admissao = data.data_admissao;
      if (data.data_renovacao !== undefined) fieldsToUpdate.data_renovacao = data.data_renovacao;
      if (data.contrato_id !== undefined) fieldsToUpdate.contrato_id = data.contrato_id;
      
      // Sempre atualiza quem modificou por último
      fieldsToUpdate.usuario_id = usuarioId;

      if (Object.keys(fieldsToUpdate).length <= 1 && !fieldsToUpdate.usuario_id) {
        return { message: "Nenhum dado para atualizar." };
      }
      
      // Passa o ID e o objeto com os campos dinâmicos para o repositório
      return await this.repository.updateByID(id, fieldsToUpdate);

    } catch (error) {
      console.error("Erro no AdmissoesService.update:", error.message);
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

export default AdmissoesService;
import CadastroRepository from '../repositories/CadastroRepository.js';
import { formatDate, sortByNearestDate, filterActiveCollaborators } from '../utils/dateUtils.js';

class CpstService {
  constructor() {
    this.repository = new CadastroRepository('admissoes', [
      'id', 'colaborador_id', 'data_admissao', 'data_renovacao', 'contrato_id', 'usuario_id'
    ]);
    this.colaboradoresRepository = new CadastroRepository('colaboradores', [
      'id', 'nome', 'status'
    ]);
    this.contratosRepository = new CadastroRepository('contratos', ['id', 'nome']);
  }

  async getAll() {
    try {
      const results = await this.repository.getAll();
      const colaboradores = await this.colaboradoresRepository.getAll();
      const contratos = await this.contratosRepository.getAll();

      // ✅ Obter apenas colaboradores ativos
      const colaboradoresAtivos = filterActiveCollaborators(colaboradores);

      // ✅ Filtrar admissões apenas dos colaboradores ativos
      const activeResults = results.filter((r) =>
        colaboradoresAtivos.some((c) => c.id === r.colaborador_id)
      );

      // ✅ Filtrar contrato_id 3 ou 4
      const filteredResults = activeResults.filter(
        (r) => r.contrato_id === 3 || r.contrato_id === 4
      );

      const sortedResults = sortByNearestDate(filteredResults, 'data_renovacao');

      const getColaboradorNome = (id) =>
        colaboradores.find((c) => c.id === id)?.nome || 'Não encontrado';

      const getContratoNome = (id) =>
        contratos.find((c) => c.id === id)?.nome || 'Não encontrado';

      return sortedResults.map((cpst) => ({
        ...cpst,
        colaborador: getColaboradorNome(cpst.colaborador_id),
        data_renovacao: formatDate(cpst.data_renovacao, 'DD/MM/YYYY'),
        contrato: getContratoNome(cpst.contrato_id),
      }));
    } catch (error) {
      throw new Error('Erro ao buscar dados');
    }
  }
}

export default CpstService;

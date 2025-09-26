import ConsultaRepository from '../repositories/ConsultaRepository.js';
import CadastroRepository from '../repositories/CadastroRepository.js';
import { formatDate, sortByNearestDate, filterActiveCollaborators } from '../utils/dateUtils.js';

class CnhService {
  constructor() {
    this.repository = new ConsultaRepository('colaboradores', ['id', 'nome', 'disciplina_id', 'data_cnh', 'status']);
    this.disciplinasRepository = new CadastroRepository('disciplinas', ['id', 'nome']);
  }

  async getAll() {
    try {
      const results = await this.repository.getAll();
      const disciplinas = await this.disciplinasRepository.getAll();
      const activeResults = filterActiveCollaborators(results);
      const sortedResults = sortByNearestDate(activeResults, 'data_cnh');

      return sortedResults.map((colaborador) => ({
        ...colaborador,
        disciplina: disciplinas.find((d) => d.id === colaborador.disciplina_id)?.nome || '',
        data_cnh: formatDate(colaborador.data_cnh, 'DD/MM/YYYY')
      }));
    } catch (error) {
      throw new Error('Erro ao buscar dados');
    }
  }
}

export default CnhService;

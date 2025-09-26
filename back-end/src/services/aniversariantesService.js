import ConsultaRepository from '../repositories/ConsultaRepository.js';
import CadastroRepository from '../repositories/CadastroRepository.js';
import { formatDate, sortByMonthAndDay, filterActiveCollaborators } from '../utils/dateUtils.js';

class AniversariantesService {
  constructor() {
    this.repository = new ConsultaRepository('colaboradores', ['id', 'nome', 'disciplina_id', 'data_nascimento', 'status']);
    this.disciplinasRepository = new CadastroRepository('disciplinas', ['id', 'nome']);
  }

  async getAll() {
    try {
      const results = await this.repository.getAll();
      const disciplinas = await this.disciplinasRepository.getAll();

      // Filtrar apenas colaboradores ativos
      const activeResults = filterActiveCollaborators(results);

      // Ordenar por mês e dia
      const sortedResults = sortByMonthAndDay(activeResults, 'data_nascimento');

      // Pegar nome da disciplina
      const getDisciplinaNome = (id) =>
        disciplinas.find((d) => d.id === id)?.nome || 'Não encontrado';

      // Formatar dados
      return sortedResults.map((colaborador) => ({
        ...colaborador,
        disciplina: getDisciplinaNome(colaborador.disciplina_id),
        data_nascimento: formatDate(colaborador.data_nascimento, 'DD/MM'),
      }));
    } catch (error) {
      throw new Error('Erro ao buscar dados');
    }
  }
}

export default AniversariantesService;

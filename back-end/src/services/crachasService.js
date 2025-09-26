import CadastroRepository from '../repositories/CadastroRepository.js';
import ConsultaRepository from '../repositories/ConsultaRepository.js';
import { filterActiveCollaborators } from '../utils/dateUtils.js';

class CrachasService {
  constructor() {
    this.repository = new ConsultaRepository('colaboradores', ['id', 'nome', 'disciplina_id', 'cracha', 'status']);
    this.disciplinasRepository = new CadastroRepository('disciplinas', ['id', 'nome']);
  }

  async getAll() {
    try {
      const results = await this.repository.getAll();
      const disciplinas = await this.disciplinasRepository.getAll();

      // Filtrar apenas colaboradores ativos
      const activeResults = filterActiveCollaborators(results);

      // Função para pegar o nome da disciplina
      const getDisciplinaNome = (id) =>
        disciplinas.find((d) => d.id === id)?.nome || 'Não encontrado';

      return activeResults.map((colaborador) => ({
        ...colaborador,
        disciplina: getDisciplinaNome(colaborador.disciplina_id),
      }));
    } catch (error) {
      throw new Error('Erro ao buscar crachás');
    }
  }
}

export default CrachasService;

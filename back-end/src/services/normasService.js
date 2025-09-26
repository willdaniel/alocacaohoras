import CadastroRepository from '../repositories/CadastroRepository.js';
import ConsultaRepository from '../repositories/ConsultaRepository.js';
import { formatDate, sortByNearestDate, filterActiveCollaborators } from '../utils/dateUtils.js';

class NormasService {
  constructor() {
    this.repository = new ConsultaRepository('colaboradores', [
      'id',
      'nome',
      'disciplina_id',
      'data_nr_06',
      'data_nr_10',
      'data_sep',
      'data_nr_20',
      'data_nr_33',
      'data_nr_35',
      'status'
    ]);
    this.disciplinasRepository = new CadastroRepository('disciplinas', ['id', 'nome']);
  }

  async getAll() {
    try {
      const colaboradores = await this.repository.getAll();
      const disciplinas = await this.disciplinasRepository.getAll();

      const ativos = filterActiveCollaborators(colaboradores);

      const nrFields = [
        { field: 'data_nr_06', tipo: 'NR 06' },
        { field: 'data_nr_10', tipo: 'NR 10' },
        { field: 'data_sep', tipo: 'NR SEP' },
        { field: 'data_nr_20', tipo: 'NR 20' },
        { field: 'data_nr_33', tipo: 'NR 33' },
        { field: 'data_nr_35', tipo: 'NR 35' }
      ];

      // 💥 Explodindo os dados
      let result = ativos.flatMap((colaborador) => {
        const disciplina = disciplinas.find((d) => d.id === colaborador.disciplina_id)?.nome || 'Não encontrado';

        return nrFields
          .filter((nr) => colaborador[nr.field]) // só pega se tiver valor
          .map((nr) => ({
            nome: colaborador.nome,
            disciplina,
            tipo: nr.tipo,
            data: colaborador[nr.field]
          }));
      });

      // 🧠 Ordenar pela data mais próxima (sem formatar ainda)
      result = sortByNearestDate(result, 'data');

      // 📅 Formatar a data
      result = result.map((item, index) => ({
        ...item,
        id: `${item.nome}-${item.tipo}-${index}`, // garante unicidade
        data: formatDate(item.data, 'DD/MM/YYYY')
      }));
      
      return result;
    } catch (error) {
      throw new Error('Erro ao buscar normas regulamentadoras');
    }
  }
}

export default NormasService;

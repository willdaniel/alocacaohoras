import ColaboradoresRepository from '../repositories/ColaboradoresRepository.js';
import CadastroRepository from '../repositories/CadastroRepository.js';
import { filterActiveCollaborators, filterInactiveCollaborators } from '../utils/dateUtils.js';

class ColaboradoresService {
  constructor() {
    this.repository = new ColaboradoresRepository();
    this.disciplinasRepository = new CadastroRepository('disciplinas', ['id', 'nome']);

    this.colunasParaInsertUpdate = [
      "nome", "nome_bh", "data_nascimento", "genero_id", "rg", "cpf", "cnpj", "nome_empresarial", "email_pessoal", 
      "numero_telefone", "cep", "endereco", "bairro", "cidade", "telefone_emergencia", "nome_emergencia", 
      "parentesco", "banco_id", "agencia", "conta", "tipo_chave_pix", "banco_pix_id", "chave_pix", "status", 
      "email_interno", "empresa", "cargo", "disciplina_id", "contrato_id", "horas_trabalhadas", "pagamento_id",
      "valor", "cracha", "data_aso", "data_pcmso", "data_pgr", "data_nr_06", "data_nr_10", "data_sep", "data_nr_20",
      "data_nr_33", "data_nr_35", "data_pta_geral", "data_apr_charqueadas", "data_apr_sapucaia","data_cnh", "vacina_hepatite_b", 
      "vacina_tetravalente", "vacina_febre_amarela", "vacina_antitetanica", "vacina_covid",
      "instituicao", "curso", "ano_conclusao", "cidade_formacao", "filhos", "permissao"
    ];
  }

  async getAllActives() {
    try {
      const colaboradores = await this.repository.getAll();
      const disciplinas = await this.disciplinasRepository.getAll();

      const activeResults = filterActiveCollaborators(colaboradores);
      const sorted = activeResults.sort((a, b) => a.id - b.id);

      const formatted = sorted.map((colaborador) => ({
        ...colaborador,
        disciplina: disciplinas.find(d => d.id === colaborador.disciplina_id)?.nome || ''
      }));

      return formatted;
    } catch (error) {
      console.error('Erro ao buscar colaboradores ativos (Service):', error);
      throw new Error('Erro ao buscar colaboradores');
    }
  }

  async getAllInactives() {
    try {
      const colaboradores = await this.repository.getAll();
      const disciplinas = await this.disciplinasRepository.getAll();

      const inactiveResults = filterInactiveCollaborators(colaboradores);
      const sorted = inactiveResults.sort((a, b) => a.id - b.id);

      const formatted = sorted.map((colaborador) => ({
        ...colaborador,
        disciplina: disciplinas.find(d => d.id === colaborador.disciplina_id)?.nome || ''
      }));

      return formatted;
    } catch (error) {
      console.error('Erro ao buscar colaboradores inativos (Service):', error);
      throw new Error('Erro ao buscar colaboradores');
    }
  }

  async getByIdComFormatacao(id) {
      try {
          const colaborador = await this.repository.getByIdComFormatacao(id);
          if (!colaborador) {
              throw new Error('Colaborador não encontrado.');
          }
          return colaborador;
      } catch (error) {
        console.error(`Erro ao buscar colaborador por ID ${id} (Service):`, error);
        throw new Error('Erro ao buscar registro no banco de dados.');
      }
    }

  async create(data) {
    try {
      const existingColaborador = await this.repository.findByNameOrEmail(data.nome, data.email_interno);
      if (existingColaborador) {
        throw new Error('Este colaborador já existe no sistema!');
      }

      if (data.ano_conclusao && /^\d{4}-\d{2}$/.test(data.ano_conclusao)) {
        data.ano_conclusao = `${data.ano_conclusao}-01`;
      }

      const valuesArray = this.colunasParaInsertUpdate.map(coluna => {
        if ((coluna.startsWith('data_') || coluna === 'ano_conclusao') && !data[coluna]) {
          return null;
        }
        return data[coluna] !== undefined ? data[coluna] : null;
      });

      return await this.repository.insertOne(valuesArray);
    } catch (error) {
      console.error('Erro detalhado ao criar colaborador (Service):', error.message, error.stack);
      throw new Error(error.message || 'Erro ao criar colaborador');
    }
  }

  async update(id, data) {
    try {
      if (data.ano_conclusao && /^\d{4}-\d{2}$/.test(data.ano_conclusao)) {
        data.ano_conclusao = `${data.ano_conclusao}-01`;
      }

      return await this.repository.updateByID(data, id);
    } catch (error) {
      console.error(`Erro detalhado ao atualizar colaborador ID ${id} (Service):`, error.message, error.stack);
      throw new Error('Erro ao atualizar colaborador');
    }
  }

  async delete(id) {
    try {
      await this.repository.deleteByID(id);
    } catch (error) {
        throw new Error('Erro ao deletar colaborador: ' + error.message);
    }
  }

  async markAsInactive(id) {
    try {
      await this.repository.updateByID({ status: false }, id);
    } catch (error) {
      throw new Error('Erro ao marcar colaborador como inativo: ' + error.message);
    }
  }

  async getTeam(user) {
    try {
      if (user.role !== 'lider' || !user.disciplinaId) {
        // Only leaders with a discipline can have a team
        return [];
      }
      return await this.repository.getTeamByDisciplinaId(user.disciplinaId);
    } catch (error) {
      console.error('Erro ao buscar equipe do líder (Service):', error);
      throw new Error('Erro ao buscar equipe');
    }
  }
}

export default ColaboradoresService;
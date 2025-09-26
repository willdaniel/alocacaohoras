import BaseRepository from "./BaseRepository.js";
import moment from 'moment';
import db from './db.js';

const columns = [
    'id', 'nome', 'nome_bh', 'data_nascimento', 'genero_id', 'rg', 'cpf', 'cnpj', 'nome_empresarial', 'email_pessoal',
    'numero_telefone', 'cep', 'endereco', 'bairro', 'cidade', 'telefone_emergencia', 'nome_emergencia',
    'parentesco', 'banco_id', 'agencia', 'conta', 'tipo_chave_pix', 'banco_pix_id', 'chave_pix', 'status',
    'email_interno', 'empresa', 'cargo', 'disciplina_id', 'contrato_id', 'horas_trabalhadas', 'pagamento_id',
    'valor', 'cracha', 'data_aso', 'data_pcmso', 'data_pgr', 'data_nr_06', 'data_nr_10', 'data_sep', 'data_nr_20',
    'data_nr_33', 'data_nr_35', 'data_pta_geral', 'data_apr_charqueadas', 'data_apr_sapucaia', 'data_cnh', 'vacina_hepatite_b',
    'vacina_tetravalente', 'vacina_febre_amarela', 'vacina_antitetanica', 'vacina_covid', 'instituicao', 'curso', 'ano_conclusao', 'cidade_formacao', 'filhos', 'permissao'
];

const columns_insert = columns.filter(c => c !== 'id');

function formatDates(data) {
    if (!data) {
        return data; // Return null/undefined as is
    }

    const formattedData = { ...data };
    const dateFields = [
        'data_nascimento', 'data_aso', 'data_pcmso', 'data_pgr',
        'data_nr_06', 'data_nr_10', 'data_sep', 'data_nr_20',
        'data_nr_33', 'data_nr_35', 'data_cnh', 'data_pta_geral', 'data_apr_charqueadas', 'data_apr_sapucaia',
        'data_admissao', 'data_renovacao_cpst', 'ano_conclusao'
    ];

    dateFields.forEach(field => {
        if (formattedData[field]) {
            formattedData[field] = moment(formattedData[field]).utc().format('YYYY-MM-DD');
        }
    });

    return formattedData;
}

class ColaboradoresRepository extends BaseRepository {
    async getAll() {
        return super.getAll('colaboradores', columns);
    }

    async getByIdComFormatacao(id) {
        const result = await super.getByID('colaboradores', columns, id);
        return formatDates(result);
    }

    async insertOne(valuesArray) {
        try {
            return await super.insertOne('colaboradores', columns_insert, valuesArray);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateByID(data, id) {
        return super.updateByID('colaboradores', data, id);
    }

    async deleteByID(id) {
        return super.deleteByID('colaboradores', id);
    }

    // --- DASHBOARD FUNCTIONS ---

    async findExpirationsByField(fieldName, startDate, endDate) {
        const allowedFields = ['data_aso', 'data_pgr', 'data_pcmso', 'data_cnh'];
        if (!allowedFields.includes(fieldName)) {
            throw new Error(`Invalid field name for expiration check: ${fieldName}`);
        }

        const query = `
            SELECT id, nome, ${fieldName} AS data
            FROM colaboradores
            WHERE ${fieldName} >= $1 AND ${fieldName} <= $2
              AND status = true
            ORDER BY ${fieldName} ASC;
        `;

        try {
            const { rows } = await db.query(query, [startDate, endDate]);
            return rows;
        } catch (error) {
            console.error(`Error finding expirations for field ${fieldName}:`, error);
            throw error;
        }
    }

    async findUpcomingNRExpirations(startDate, endDate) {
        const query = `
            SELECT id, nome, tipo, data
            FROM (
                SELECT 
                    id, 
                    nome,
                    unnest(array['NR-06', 'NR-10', 'NR-20', 'NR-33', 'NR-35']) as tipo,
                    unnest(array[data_nr_06, data_nr_10, data_nr_20, data_nr_33, data_nr_35]) as data
                FROM colaboradores
                WHERE status = true
            ) as unpivoted_nrs
            WHERE data BETWEEN $1 AND $2
            ORDER BY data ASC;
        `;

        try {
            const { rows } = await db.query(query, [startDate, endDate]);
            return rows;
        } catch (error) {
            console.error('Error finding upcoming NR expirations:', error);
            throw error;
        }
    }

    async findBirthdaysByMonth(month) {
        const query = `
            SELECT id, nome, data_nascimento
            FROM colaboradores
            WHERE EXTRACT(MONTH FROM data_nascimento) = $1
              AND status = true
            ORDER BY EXTRACT(DAY FROM data_nascimento) ASC;
        `;

        try {
            const { rows } = await db.query(query, [month]);
            return rows;
        } catch (error) {
            console.error('Error finding birthdays by month:', error);
            throw error;
        }
    }

    
    async countByGender() {
        const query = `
            SELECT
                g.nome,
                CAST(COUNT(c.id) AS INTEGER) as value
            FROM
                colaboradores c
            JOIN
                generos g ON c.genero_id = g.id
            WHERE
                c.status = true
            GROUP BY
                g.nome;
        `;
        try {
            const { rows } = await db.query(query);
            return rows;
        } catch (error) {
            console.error('Error counting by gender:', error);
            throw error;
        }
    }

    async getTeamByDisciplinaId(disciplinaId) {
        const query = `
            SELECT
                c.id as colaborador_id,
                c.nome,
                u.id as usuario_id
            FROM colaboradores c
            JOIN usuarios u ON c.id = u.colaborador_id
            WHERE c.disciplina_id = $1 AND c.status = true
            ORDER BY c.nome;
        `;
        try {
            const { rows } = await db.query(query, [disciplinaId]);
            return rows;
        } catch (error) {
            console.error(`Error finding team for disciplina ${disciplinaId}:`, error);
            throw error;
        }
    }

    async findByNameOrEmail(nome, email_interno) {
        const query = `
            SELECT id, nome, email_interno
            FROM colaboradores
            WHERE nome = $1 OR email_interno = $2;
        `;
        try {
            const { rows } = await db.query(query, [nome, email_interno]);
            return rows[0];
        } catch (error) {
            console.error(`Error finding collaborator by name or email:`, error);
            throw error;
        }
    }
}

export default ColaboradoresRepository;

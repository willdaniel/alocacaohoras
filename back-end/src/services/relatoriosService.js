import db from '../repositories/db.js';
import excel from 'exceljs';
import { Parser } from 'json2csv';

class RelatoriosService {
  async generateAllocationsReport({ format, userId, role }) {
    let query = `
      SELECT 
        TO_CHAR(a.data, 'DD/MM/YYYY') as data, 
        col.nome as usuario_nome,
        CASE
          WHEN a.tipo <> 'Projeto' THEN a.tipo
          ELSE COALESCE(CONCAT_WS('_', c.nome, NULLIF(c.nome_cliente, ''), NULLIF(c.descricao, '')), a.comentarios)
        END as cliente_projeto,
        CASE
          WHEN a.tipo <> 'Projeto' THEN a.tipo
          ELSE d.nome 
        END as disciplina_nome,
        a.horas,
        a.local, 
        a.tipo, 
        a.horario_inicial,
        a.horario_final,
        a.email_interno as email,
        a.comentarios as comentarios
      FROM alocacoes a
      JOIN usuarios u ON a.usuario_id = u.id
      JOIN colaboradores col ON u.colaborador_id = col.id
      LEFT JOIN clientes c ON a.cliente_id = c.id
      LEFT JOIN disciplinas d ON a.disciplina_id = d.id
    `;
    const params = [];

    if (role === 'usuario') {
      query += ' WHERE a.usuario_id = $1';
      params.push(userId);
    } else if (role === 'lider') {
      const leaderDisciplinaQuery = `
        SELECT c.disciplina_id 
        FROM usuarios u
        JOIN colaboradores c ON u.colaborador_id = c.id
        WHERE u.id = $1
      `;
      const { rows: leaderRows } = await db.query(leaderDisciplinaQuery, [userId]);
      
      if (leaderRows.length > 0 && leaderRows[0].disciplina_id) {
        const disciplinaId = leaderRows[0].disciplina_id;
        query += ' WHERE col.disciplina_id = $1';
        params.push(disciplinaId);
      } else {
        query += ' WHERE a.usuario_id = $1';
        params.push(userId);
      }
    }

    query += ' ORDER BY a.data DESC, col.nome;';

    const { rows } = await db.query(query, params);

    const columns = [
      { header: 'Data', key: 'data', width: 15 },
      { header: 'Colaborador', key: 'usuario_nome', width: 30 },
      { header: 'Projeto', key: 'cliente_projeto', width: 40 },
      { header: 'Disciplina', key: 'disciplina_nome', width: 25 },
      { header: 'Total Horas', key: 'horas', width: 12, style: { numFmt: '0.00' } },
      { header: 'Horário Inicial', key: 'horario_inicial', width: 15, style: { numFmt: 'hh:mm' } },
      { header: 'Horário Final', key: 'horario_final', width: 15, style: { numFmt: 'hh:mm' } },
      { header: 'Local', key: 'local', width: 20 },
      { header: 'Tipo', key: 'tipo', width: 20 },
      { header: 'E-mail', key: 'email', width: 30 },
      { header: 'Comentários', key: 'comentarios', width: 50 },
    ];

    if (format === 'xlsx') {
      const workbook = new excel.Workbook();
      const worksheet = workbook.addWorksheet('Alocações');
      worksheet.columns = columns;

      const processedRows = rows.map(row => ({
        ...row,
        horas: parseFloat(row.horas) || 0,
      }));

      if (processedRows.length > 0) {
        worksheet.addRows(processedRows);
      }

      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF36454F' }
        };
        cell.font = {
          color: { argb: 'FFFFFFFF' },
          bold: true
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
      headerRow.height = 20;

      worksheet.autoFilter = {
        from: 'A1',
        to: { row: 1, column: columns.length }
      };

      return workbook.xlsx.writeBuffer();
    } else if (format === 'csv') {
      if (rows.length === 0) {
        return '';
      }
      const json2csvParser = new Parser({ fields: columns.map(c => c.key) });
      return json2csvParser.parse(rows);
    } else {
      throw new Error('Formato de relatório inválido.');
    }
  }
}

export default RelatoriosService;
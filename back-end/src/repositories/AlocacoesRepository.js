import db from './db.js';

class AlocacoesRepository {
  static async getAll(user) {
    let query;
    let params = [];
    let whereClause = '';
    let groupByClause = 'GROUP BY c.nome, col.nome';
    let orderByClause = 'ORDER BY total_horas DESC';

    const baseQuery = `
      SELECT c.nome, col.nome as usuario_nome, SUM(a.horas) as total_horas 
      FROM alocacoes a 
      JOIN clientes c ON a.cliente_id = c.id 
      JOIN usuarios u ON a.usuario_id = u.id
      JOIN colaboradores col ON u.colaborador_id = col.id
    `;

    if (user.role === 'master') {
      query = baseQuery;
    } else if (user.role === 'lider') {
      whereClause = ` WHERE col.disciplina_id = $1`;
      params.push(user.disciplinaId);
      query = baseQuery;
    } else {
      whereClause = ` WHERE u.id = $1`;
      params.push(user.userId);
      query = baseQuery;
    }
    
    query += whereClause + ' ' + groupByClause + ' ' + orderByClause;
    
    const result = await db.query(query, params);
    return result.rows;
  }

  static async getTop3ByWeek(user) {
    let query = `
      SELECT
        c.nome || '_' || COALESCE(c.descricao, '') as nome,
        col.nome as usuario_nome,
        SUM(a.horas) as total_horas
      FROM alocacoes a
      JOIN clientes c ON a.cliente_id = c.id
      JOIN usuarios u ON a.usuario_id = u.id
      JOIN colaboradores col ON u.colaborador_id = col.id
      WHERE a.data >= date_trunc('week', CURRENT_DATE)
    `;
    let params = [];
    let whereClause = '';
    let limitClause = ' LIMIT 3';
    let groupByClause = ' GROUP BY c.nome, col.nome, c.descricao';
    let orderByClause = ' ORDER BY total_horas DESC';

    if (user.role === 'lider') {
      whereClause = ` AND col.disciplina_id = $1`;
      params.push(user.disciplinaId);
    } else if (user.role !== 'master') {
      whereClause = ` AND u.id = $1`;
      params.push(user.userId);
    }
    
    query += whereClause + groupByClause + orderByClause + limitClause;
    
    const result = await db.query(query, params);
    return result.rows;
  }

  static async getHorasProjetoSemana(projeto) {
    const query = `
      SELECT 
        to_char(a.data, 'YYYY-MM-DD') as dia,
        SUM(a.horas) as total_horas
      FROM alocacoes a
      JOIN clientes c ON a.cliente_id = c.id
      WHERE c.nome = $1 AND a.data >= date_trunc('week', CURRENT_DATE)
      GROUP BY dia
      ORDER BY dia;
    `;
    const values = [projeto];
    const result = await db.query(query, values);
    return result.rows;
  }

    static async getTotalMonthlyHours(user) {
    let query;
    let params = [];
    let whereClause = '';

    const baseQuery = `
      SELECT SUM(horas) as total_horas_mes
      FROM alocacoes a
      JOIN usuarios u ON a.usuario_id = u.id
      JOIN colaboradores col ON u.colaborador_id = col.id
      WHERE a.data >= date_trunc('month', CURRENT_DATE)
        AND a.data < date_trunc('month', CURRENT_DATE) + interval '1 month'
    `;

    if (user.role === 'master') {
      query = baseQuery;
    } else if (user.role === 'lider') {
      whereClause = ` AND col.disciplina_id = $1`;
      params.push(user.disciplinaId);
      query = baseQuery;
    } else {
      whereClause = ` AND u.id = $1`;
      params.push(user.userId);
      query = baseQuery;
    }
    
    query += whereClause;
    
    const result = await db.query(query, params);
    return result.rows[0]?.total_horas_mes || 0;
  }

  static async getAllocatedProjectsAndHours(user, disciplina) {
    try {
      let query;
      let params = [];
      let whereClause = '';
      let orderByClause = 'ORDER BY a.data DESC';

      const baseQuery = `
        SELECT
          a.id, a.data, a.local, a.tipo,
          COALESCE(c.nome, a.comentarios, a.tipo) as cliente_nome,
          d.nome as disciplina_nome,
          a.horas, a.horario_inicial, a.horario_final, a.comentarios,
          col.nome as usuario_nome,
          a.email_interno
        FROM alocacoes a
        LEFT JOIN clientes c ON a.cliente_id = c.id
        JOIN disciplinas d ON a.disciplina_id = d.id
        JOIN usuarios u ON a.usuario_id = u.id
        JOIN colaboradores col ON u.colaborador_id = col.id
      `;

      if (user.role === 'master') {
        query = baseQuery;
      } else if (user.role === 'lider') {
        console.log('Lider role detected.');
        console.log('Disciplina parameter (from frontend): ', disciplina);
        console.log('User discipline ID (from backend user object): ', user.disciplinaId);

        if (disciplina) {
          whereClause = ` WHERE d.nome = $1`;
          params.push(disciplina);
          console.log('Filtering by discipline name: ', disciplina);
        } else {
          whereClause = ` WHERE col.disciplina_id = $1`;
          params.push(user.disciplinaId);
          console.log('Filtering by user discipline ID: ', user.disciplinaId);
        }
        query = baseQuery;
      } else { // 'usuario' role
        whereClause = ` WHERE u.id = $1`;
        params.push(user.userId);
        query = baseQuery;
      }

      query += whereClause + ' ' + orderByClause;

      console.log('Final Query: ', query);
      console.log('Final Params: ', params);

      const result = await db.query(query, params);
      console.log(`Query executada com sucesso para usuário ${user.userId} com permissão ${user.role}`);
      return result.rows;
    
    } catch (error) {
      console.error('Erro em AlocacoesRepository.getAllocatedProjectsAndHours:', error);
      throw error;
    }
  }

  static async getById(id, user) {
    let query = `
      SELECT
        a.id, a.data, a.local, a.tipo, a.cliente_id, a.disciplina_id,
        a.horas, a.horario_inicial, a.horario_final, a.comentarios,
        a.usuario_id, a.email_interno
      FROM alocacoes a
      JOIN usuarios u ON a.usuario_id = u.id
      JOIN colaboradores col ON u.colaborador_id = col.id
      WHERE a.id = $1
    `;
    let params = [id];

    if (user.role === 'lider') {
      query += ` AND col.disciplina_id = $2`;
      params.push(user.disciplinaId);
    } else if (user.role !== 'master') {
      query += ` AND u.id = $2`;
      params.push(user.userId);
    }

    const result = await db.query(query, params);
    return result.rows[0];
  }

  static async getLastAllocatedHour(user) {
    let query = `
      SELECT
        a.id, a.data, a.local, a.tipo, a.cliente_id, a.disciplina_id,
        a.horas, a.horario_inicial, a.horario_final, a.comentarios,
        COALESCE(c.nome, a.comentarios, a.tipo) as cliente_nome, d.nome as disciplina_nome,
        col.nome as usuario_nome, a.email_interno
      FROM alocacoes a
      LEFT JOIN clientes c ON a.cliente_id = c.id
      JOIN disciplinas d ON a.disciplina_id = d.id
      JOIN usuarios u ON a.usuario_id = u.id
      JOIN colaboradores col ON u.colaborador_id = col.id
      WHERE u.id = $1
      ORDER BY a.data DESC, a.horario_final DESC
      LIMIT 1
    `;
    const params = [user.userId];

    const result = await db.query(query, params);
    return result.rows[0];
  }

  static async delete(id, user) {
    let query = `DELETE FROM alocacoes WHERE id = $1`;
    const params = [id];

    if (user.role === 'lider') {
      query += ` AND usuario_id IN (SELECT id FROM usuarios WHERE colaborador_id IN (SELECT id FROM colaboradores WHERE disciplina_id = $2))`;
      params.push(user.disciplinaId);
    } else if (user.role !== 'master') {
      query += ` AND usuario_id = $2`;
      params.push(user.userId);
    }
    
    const result = await db.query(query, params);
    return result.rowCount;
  }

  static async update(id, data, user) {
    const { date, local, tipo, cliente_id, disciplina_id, horas, startTime, endTime, comments } = data;

    let final_cliente_id = cliente_id;
    if (isNaN(parseInt(final_cliente_id, 10))) {
      final_cliente_id = null;
    }

    let query = `
      UPDATE alocacoes
      SET
        data = $1,
        local = $2,
        tipo = $3,
        cliente_id = $4,
        disciplina_id = $5,
        horas = $6,
        horario_inicial = $7,
        horario_final = $8,
        comentarios = $9
      WHERE id = $10
    `;
    const params = [
      date, local, tipo, final_cliente_id, disciplina_id, horas,
      startTime, endTime, comments, id
    ];

    if (user.role === 'lider') {
      query += ` AND usuario_id IN (SELECT id FROM usuarios WHERE colaborador_id IN (SELECT id FROM colaboradores WHERE disciplina_id = $11))`;
      params.push(user.disciplinaId);
    } else if (user.role !== 'master') {
      query += ` AND usuario_id = $11`;
      params.push(user.userId);
    }

    const result = await db.query(query, params);
    return result.rowCount > 0 ? { id, ...data } : null;
  }

  static async create(data) {
    const { date, local, tipo, cliente_id, disciplina_id, horas, startTime, endTime, comments, usuario_id } = data;

    try {
      const emailQuery = `
        SELECT col.email_interno 
        FROM usuarios u
        JOIN colaboradores col ON u.colaborador_id = col.id
        WHERE u.id = $1;
      `;
      const emailResult = await db.query(emailQuery, [usuario_id]);
      const emailInterno = emailResult.rows[0]?.email_interno || null;

      let final_cliente_id = cliente_id;
      if (isNaN(parseInt(final_cliente_id, 10))) {
        final_cliente_id = null;
      }

      const insertQuery = `
        INSERT INTO alocacoes (
          data, local, tipo, cliente_id, disciplina_id, horas, 
          horario_inicial, horario_final, comentarios, usuario_id, email_interno
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *;
      `;
      
      const insertValues = [
        date, local, tipo, final_cliente_id, disciplina_id, horas, 
        startTime, endTime, comments, usuario_id, emailInterno
      ];
      
      const finalResult = await db.query(insertQuery, insertValues);
      return finalResult.rows[0];

    } catch (error) {
      console.error("Erro ao criar alocação:", error);
      throw error;
    }
  }
}

export default AlocacoesRepository;
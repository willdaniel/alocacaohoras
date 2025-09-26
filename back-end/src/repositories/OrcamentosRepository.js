import db from './db.js';

class OrcamentosRepository {
  static async getAll() {
    const rows = await db.query('SELECT * FROM orcamentos');
    return rows;
  }
}

export default OrcamentosRepository;

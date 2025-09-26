import db from './db.js'

class BaseRepository {
    async getAll(table, columnsArray, transactionClient = db) {
        try {
            const results = (await transactionClient.query(`SELECT ${columnsArray.join(', ')} FROM ${table}`)).rows;
            return results;
        } catch (error) {
            throw error;
        }
    }

    async getByID(table, columnsArray, id, transactionClient = db) {
        try {
            const queryText = `SELECT ${columnsArray.join(', ')} FROM ${table} WHERE id = $1`;
            const result = (await transactionClient.query(queryText, [id])).rows[0];
            return result;
        } catch (error) {
            throw error;
        }
    }
    
    async getByEmail(table, columnsArray, email, transactionClient = db) {
        try {
            const queryText = `SELECT ${columnsArray.join(', ')} FROM ${table} WHERE email_interno = $1`;
            const result = (await transactionClient.query(queryText, [email])).rows[0];
            return result;
        } catch (error) {
            throw error;
        }
    }

    async insertOne(table, columnsArray, valuesArray, transactionClient = db) {
        if (!/^[a-zA-Z0-9_]+$/.test(table)) {
            throw new Error('Nome da tabela inválido');
        }
        const normalizeValues = (values) => {
            return values.map(value => (value === '' || value === undefined) ? null : value);
        };
        const normalizedValues = normalizeValues(valuesArray);
        
        // ⭐ CORRIGIDO: Usa placeholders ($1, $2, ...) para os valores.
        const placeholders = columnsArray.map((_, index) => `$${index + 1}`).join(', ');
        const queryText = `INSERT INTO ${table} (${columnsArray.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        
        const result = await transactionClient.query(queryText, normalizedValues);
        return result.rows[0];
    }
    
    async updateByID(table, columnsArray, valuesArray, id, transactionClient = db) {
        console.log('updateByID:', { table, columnsArray, valuesArray, id });

        const checkQuery = `SELECT id FROM ${table} WHERE id = $1`;
        const checkResult = await transactionClient.query(checkQuery, [id]);
        if (checkResult.rows.length === 0) {
            throw new Error('Registro não encontrado');
        }

        // ⭐ CORRIGIDO: Usa placeholders ($1, $2, ...) para a cláusula SET.
        const setClause = columnsArray.map((col, index) => `${col} = $${index + 1}`).join(', ');
        const queryText = `UPDATE ${table} SET ${setClause} WHERE id = $${columnsArray.length + 1}`;
        
        await transactionClient.query(queryText, [...valuesArray, id]);
    }

    async deleteByID(table, id, transactionClient = db) {
        const exists = await this.getByID(table, ['id'], id, transactionClient);
        if (!exists) {
            throw new Error('Registro não encontrado');
        }
        
        const queryText = `DELETE FROM ${table} WHERE id = $1`;
        await transactionClient.query(queryText, [id]);
    }
}
    
export default BaseRepository;
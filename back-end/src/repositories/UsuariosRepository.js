import BaseRepository from "./BaseRepository.js";
import db from './db.js';

const columns = [
    'id', 'email', 'role', 'colaborador_id'
];

class UsuariosRepository extends BaseRepository {
    constructor() {
        super('usuarios', columns);
    }

    async getAllUserIds() {
        try {
            const query = `SELECT id FROM usuarios;`;
            const { rows } = await db.query(query);
            return rows.map(row => row.id);
        } catch (error) {
            console.error("Error getting all user IDs:", error);
            throw new Error('Error getting all user IDs');
        }
    }
}

export default UsuariosRepository;

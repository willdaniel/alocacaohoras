import db from '../repositories/db.js';

const getDisciplinaId = async (userId) => {
    const { rows } = await db.query(
        `SELECT c.disciplina_id
         FROM usuarios u
         JOIN colaboradores c ON u.colaborador_id = c.id
         WHERE u.id = $1`,
        [userId]
    );
    return rows[0]?.disciplina_id;
};

const getTaskById = async (id) => {
    const query = `
        SELECT 
            t.*,
            COALESCE(assignee.nome, 'Não atribuído') as assignee_name,
            creator.nome as creator_name
        FROM tasks t
        LEFT JOIN usuarios u_assignee ON t.assigned_to_id = u_assignee.id
        LEFT JOIN colaboradores assignee ON u_assignee.colaborador_id = assignee.id
        LEFT JOIN usuarios u_creator ON t.creator_id = u_creator.id
        LEFT JOIN colaboradores creator ON u_creator.colaborador_id = creator.id
        WHERE t.id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
};

const getTasks = async (user) => {
    if (!user || !user.role) {
        console.error("getTasks was called with an invalid user object:", user);
        throw new Error("User data is missing or invalid.");
    }

    let query = `
        SELECT 
            t.id, t.text, t.completed, t.assigned_to_id, t.creator_id,
            COALESCE(assignee.nome, 'Não atribuído') as assignee_name,
            creator.nome as creator_name
        FROM tasks t
        LEFT JOIN usuarios u_assignee ON t.assigned_to_id = u_assignee.id
        LEFT JOIN colaboradores assignee ON u_assignee.colaborador_id = assignee.id
        LEFT JOIN usuarios u_creator ON t.creator_id = u_creator.id
        LEFT JOIN colaboradores creator ON u_creator.colaborador_id = creator.id
    `;
    let params = [];

    if (!user.userId) {
        throw new Error("User ID is missing for task visibility check.");
    }
    query += ` WHERE t.creator_id = $1 OR t.assigned_to_id = $1`;
    params.push(user.userId);

    query += ` ORDER BY t.completed ASC, t.id DESC`;

    const { rows } = await db.query(query, params);
    return rows;
};

const createTask = async (task, user) => {
    const { text, assigned_to_id } = task;
    const creator_id = user.userId;

    let final_assigned_to_id = assigned_to_id;

    if (user.role === 'usuario') {
        final_assigned_to_id = creator_id;
    } else if (user.role === 'lider') {
        if (assigned_to_id && assigned_to_id !== creator_id) {
            const liderDisciplinaId = await getDisciplinaId(creator_id);
            const assigneeDisciplinaId = await getDisciplinaId(assigned_to_id);
            if (liderDisciplinaId !== assigneeDisciplinaId) {
                throw new Error('Líderes só podem designar tarefas para usuários da mesma disciplina.');
            }
        }
    }

    const query = `
        WITH inserted_task AS (
            INSERT INTO tasks (text, creator_id, assigned_to_id)
            VALUES ($1, $2, $3)
            RETURNING *
        )
        SELECT
            it.*,
            COALESCE(assignee.nome, 'Não atribuído') as assignee_name,
            creator.nome as creator_name
        FROM inserted_task it
        LEFT JOIN usuarios u_assignee ON it.assigned_to_id = u_assignee.id
        LEFT JOIN colaboradores assignee ON u_assignee.colaborador_id = assignee.id
        LEFT JOIN usuarios u_creator ON it.creator_id = u_creator.id
        LEFT JOIN colaboradores creator ON u_creator.colaborador_id = creator.id;
    `;
    const { rows } = await db.query(query, [text, creator_id, final_assigned_to_id]);
    if (rows.length === 0) {
        throw new Error('Falha ao criar a tarefa.');
    }
    return rows[0];
};

const updateTask = async (id, updatedTaskData, user) => {
    const originalTask = await getTaskById(id);
    if (!originalTask) {
        return null; 
    }
    
    const setClauses = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(updatedTaskData).forEach((key) => {
        if (['text', 'completed', 'assigned_to_id'].includes(key)) {
            setClauses.push(`${key} = $${paramIndex}`);
            if (key == 'completed') {
                values.push(updatedTaskData[key] ? 1 : 0);
            } else {
                values.push(updatedTaskData[key]);
            }
            paramIndex++;
        }
    });

    if (setClauses.length === 0) {
        return getTaskById(id);
    }

    const idParamIndex = paramIndex;
    values.push(id);

    const query = `
        WITH updated_task AS (
            UPDATE tasks
            SET ${setClauses.join(', ')}
            WHERE id = $${idParamIndex}
            RETURNING *
        )
        SELECT 
            ut.*,
            COALESCE(assignee.nome, 'Não atribuído') as assignee_name,
            creator.nome as creator_name
        FROM updated_task ut
        LEFT JOIN usuarios u_assignee ON ut.assigned_to_id = u_assignee.id
        LEFT JOIN colaboradores assignee ON u_assignee.colaborador_id = assignee.id
        LEFT JOIN usuarios u_creator ON ut.creator_id = u_creator.id
        LEFT JOIN colaboradores creator ON u_creator.colaborador_id = creator.id;
    `;

    const { rows } = await db.query(query, values);
    return rows[0];
};

const deleteTask = async (id, user) => {
    const task = await getTaskById(id);
    if (!task) {
        return; // Task not found, consider it a success for deletion.
    }

    if (user.role === 'usuario' && task.creator_id !== user.userId) {
        const error = new Error('Usuários só podem deletar tarefas que eles criaram.');
        error.code = 'PERMISSION_DENIED';
        throw error;
    }

    await db.query('DELETE FROM tasks WHERE id = $1', [id]);
};

export default { getTasks, getTaskById, createTask, updateTask, deleteTask };
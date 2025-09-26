import tasksService from '../services/tasksService.js';
import NotificacoesService from '../services/notificacoesService.js';

const notificacoesService = new NotificacoesService();

const getTasks = async (req, res) => {
    try {
        const tasks = await tasksService.getTasks(req.user);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: `Erro ao buscar tarefas: ${error.message}` });
    }
};

const createTask = async (req, res) => {
    try {
        const newTask = await tasksService.createTask(req.body, req.user);

        // If the task is assigned to someone other than the creator, send a notification.
        if (newTask.assigned_to_id && newTask.assigned_to_id !== req.user.userId) {
            await notificacoesService.create({
                usuario_id: newTask.assigned_to_id,
                mensagem: `De: ${req.user.nome}. Nova tarefa para você: "${newTask.text}"`,
                tipo: 'tarefa',
                link: '/dashboard'
            });
        }

        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: `Erro ao criar tarefa: ${error.message}` });
    }
};

const updateTask = async (req, res) => {
    try {
        
        const taskBeforeUpdate = await tasksService.getTaskById(req.params.id);

        const updatedTask = await tasksService.updateTask(req.params.id, req.body, req.user);
        if (updatedTask) {
            const oldAssigneeId = taskBeforeUpdate ? taskBeforeUpdate.assigned_to_id : null;
            const newAssigneeId = updatedTask.assigned_to_id;

            // Notify if the assignee has changed to a new user (who is not the one making the edit)
            if (newAssigneeId && newAssigneeId !== oldAssigneeId && newAssigneeId !== req.user.userId) {
                await notificacoesService.create({
                    usuario_id: newAssigneeId,
                    mensagem: `De: ${req.user.nome}. Tarefa atribuída a você: "${updatedTask.text}"`,
                    tipo: 'tarefa',
                    link: '/dashboard'
                });
            }
            res.json(updatedTask);
        } else {
            res.status(404).json({ message: "Task not found or permission denied." });
        }
    } catch (error) {
        res.status(500).json({ message: `Erro ao atualizar tarefa: ${error.message}` });
    }
};

const deleteTask = async (req, res) => {
    try {
        await tasksService.deleteTask(req.params.id, req.user);
        res.status(204).send();
    } catch (error) {
        if (error.code === 'PERMISSION_DENIED') {
            res.status(403).json({ message: error.message });
        } else {
            res.status(500).json({ message: `Erro ao deletar tarefa: ${error.message}` });
        }
    }
};

export {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
};
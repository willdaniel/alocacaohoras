import AlocacoesService from '../services/alocacoesService.js';
import db from '../repositories/db.js';

class AlocacoesController {
    static async getAll(req, res) {
        try {
            const alocacoes = await AlocacoesService.getAll(req.user);
            res.status(200).json(alocacoes);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getTop3ByWeek(req, res) {
        try {
            const top3 = await AlocacoesService.getTop3ByWeek(req.user);
            res.status(200).json(top3);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getHorasProjetoSemana(req, res) {
        try {
            const { projeto } = req.query;
            const horas = await AlocacoesService.getHorasProjetoSemana(projeto);
            res.status(200).json(horas);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getAllocatedProjectsAndHours(req, res) {
        try {
            const { disciplina } = req.query;
            const data = await AlocacoesService.getAllocatedProjectsAndHours(req.user, disciplina);
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const alocacao = await AlocacoesService.getById(id, req.user);
            if (alocacao) {
                res.status(200).json(alocacao);
            } else {
                res.status(404).json({ message: 'Alocação não encontrada.' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getLastAllocatedHour(req, res) {
        try {
            const lastAllocation = await AlocacoesService.getLastAllocatedHour(req.user);
            if (lastAllocation) {
                res.status(200).json(lastAllocation);
            } else {
                res.status(404).json({ message: 'Nenhuma alocação encontrada para o usuário.' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            await AlocacoesService.delete(id, req.user);
            res.status(200).json({ message: 'Alocação deletada com sucesso!' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const updatedAlocacao = await AlocacoesService.update(id, req.body, req.user);
            if (updatedAlocacao) {
                res.status(200).json(updatedAlocacao);
            } else {
                res.status(404).json({ message: 'Alocação não encontrada ou não autorizada.' });
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async create(req, res) {
        try {
            const newAlocacao = await AlocacoesService.create(req.body, req.user);
            res.status(201).json(newAlocacao);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

export default AlocacoesController;

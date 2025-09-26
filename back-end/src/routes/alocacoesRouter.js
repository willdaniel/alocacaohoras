import express from 'express';
import AlocacoesController from '../controllers/alocacoesController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Aplica o middleware de autenticação em todas as rotas
router.use(authMiddleware);

router.post('/', AlocacoesController.create);
router.get('/', AlocacoesController.getAll);
router.get('/top3', AlocacoesController.getTop3ByWeek);
router.get('/horas-projeto-semana', AlocacoesController.getHorasProjetoSemana);
router.get('/all-allocated-projects-hours', AlocacoesController.getAllocatedProjectsAndHours);
router.get('/last', AlocacoesController.getLastAllocatedHour);
router.put('/:id', AlocacoesController.update);
router.delete('/:id', AlocacoesController.delete);

export default router;


import { Router } from 'express';
import IntegracoesController from '../controllers/integracoesController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();
const controller = new IntegracoesController();

// Middleware aplicado pra todas as rotas abaixo
router.use(authMiddleware);

// Rotas que delegam as operações ao UsersController
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;

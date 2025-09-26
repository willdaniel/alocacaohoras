import { Router } from 'express';
import ExamesController from '../controllers/examesController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();
const controller = new ExamesController();

// Middleware aplicado pra todas as rotas abaixo
router.use(authMiddleware);

router.get('/', controller.getAll);

export default router;

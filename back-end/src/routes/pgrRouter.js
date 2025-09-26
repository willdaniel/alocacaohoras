import { Router } from 'express';
import PgrController from '../controllers/pgrController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();
const controller = new PgrController();

// Middleware aplicado pra todas as rotas abaixo
router.use(authMiddleware);

router.get('/', controller.getAll);

export default router;

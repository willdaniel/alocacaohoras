import { Router } from 'express';
import TotalSalariosController from '../controllers/totalSalariosController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();
const controller = new TotalSalariosController();

// Middleware aplicado pra todas as rotas abaixo
router.use(authMiddleware);

router.get('/', controller.getAll);

export default router;

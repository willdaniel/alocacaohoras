import { Router } from 'express';
import CpstController from '../controllers/cpstController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();
const controller = new CpstController();

// Middleware aplicado pra todas as rotas abaixo
router.use(authMiddleware);

router.get('/', controller.getAll);

export default router;

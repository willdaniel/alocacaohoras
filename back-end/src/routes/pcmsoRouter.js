import { Router } from 'express';
import PcmsoController from '../controllers/pcmsoController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();
const controller = new PcmsoController();

// Middleware aplicado pra todas as rotas abaixo
router.use(authMiddleware);

router.get('/', controller.getAll);

export default router;

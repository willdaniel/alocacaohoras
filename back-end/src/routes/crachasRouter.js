import { Router } from 'express';
import CrachasController from '../controllers/crachasController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();
const controller = new CrachasController();

// Middleware aplicado pra todas as rotas abaixo
router.use(authMiddleware);

router.get('/', controller.getAll);

export default router;

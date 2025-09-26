import { Router } from 'express';
import NormasController from '../controllers/normasController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();
const controller = new NormasController();

// Middleware aplicado pra todas as rotas abaixo
router.use(authMiddleware);

router.get('/', controller.getAll);

export default router;

import { Router } from 'express';
import CnhController from '../controllers/ccnhController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();
const controller = new CnhController();
// Middleware aplicado pra todas as rotas abaixo
router.use(authMiddleware);

router.get('/', controller.getAll);

export default router;

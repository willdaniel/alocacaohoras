import { Router } from 'express';
import DemissoesController from '../controllers/demissoesController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();
const controller = new DemissoesController();

// Middleware aplicdeo pra todas as rotas abaixo
router.use(authMiddleware);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;

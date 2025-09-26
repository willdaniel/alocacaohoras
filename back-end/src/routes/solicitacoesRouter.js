import { Router } from 'express';
import solicitacoesController from '../controllers/solicitacoesController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', solicitacoesController.create);
router.get('/user', solicitacoesController.getByUserId);
router.get('/manager', solicitacoesController.getByManagerId);
router.get('/retroactive-permission', solicitacoesController.getRetroactivePermission);
router.delete('/:id', solicitacoesController.delete);
router.put('/:id/status', solicitacoesController.updateStatus);

export default router;
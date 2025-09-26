import { Router } from 'express';
import NfsController from '../controllers/nfsController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/upload', NfsController.uploadNfs);

export default router;

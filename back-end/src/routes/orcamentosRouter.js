import express from 'express';
import OrcamentosController from '../controllers/orcamentosController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Aplica o middleware de autenticação
router.use(authMiddleware);

router.get('/', OrcamentosController.getAll);

export default router;

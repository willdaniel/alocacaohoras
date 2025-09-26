import { Router } from 'express';
import cadastroController from '../controllers/cadastroController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();
const controller = new cadastroController('disciplinas', ['id', 'nome']);

// Middleware de autenticação apenas (sem verificação de role)
router.use(authMiddleware);

// Apenas rota de leitura
router.get('/', controller.getAll);

export default router;

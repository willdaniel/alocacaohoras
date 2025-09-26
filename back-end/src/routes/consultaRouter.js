import { Router } from 'express';
import consultaController from '../controllers/consultaController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

export default function consultaRouter(tabela, columns) {
  const router = Router();
  const controller = new consultaController(tabela, columns);

  // Middleware aplicado pra todas as rotas abaixo
  router.use(authMiddleware);

  router.get('/', controller.getAll);

  return router;
}

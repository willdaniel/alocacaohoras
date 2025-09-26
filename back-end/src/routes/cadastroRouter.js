import { Router } from 'express';
import cadastroController from '../controllers/cadastroController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import checkRole from '../middlewares/checkRole.js'; // Importe o middleware de permissão

export default function cadastroRouter(tabela, columns) {
    const router = Router();
    const controller = new cadastroController(tabela, columns);

    // Middleware de autenticação para todas as rotas
    router.use(authMiddleware);

    // Rotas de leitura - acessíveis para todos os usuários autenticados
    router.get('/', controller.getAll);
    router.get('/:id', controller.getById);

    // Rotas de escrita - apenas para admins
    router.use(checkRole(['master']));
    router.post('/', controller.create);
    router.put('/:id', controller.update);
    router.delete('/:id', controller.delete);

    return router;
}
import { Router } from 'express';
import usuariosController from '../controllers/usuariosController.js'; // Importa o controller
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router(); // Cria o roteador

// Middleware aplicado pra todas as rotas abaixo
router.use(authMiddleware);

// Rotas que delegam as operações ao UsersController
router.get('/', usuariosController.getAll);
router.get('/managers', usuariosController.getManagers);
router.get('/:id', usuariosController.getById);
router.post('/', usuariosController.create);
router.put('/:id', usuariosController.update);
router.delete('/:id', usuariosController.delete);

export default router; // Exporta o roteador


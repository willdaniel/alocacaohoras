import { Router } from 'express';
import ColaboradoresController from '../controllers/colaboradoresController.js'; // Importa o controller
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router(); // Cria o roteador

// Middleware aplicado pra todas as rotas abaixo
router.use(authMiddleware);

// As rotas '/' e '/ativos' retornam os colaboradores ativos
router.get(['/', '/ativos'], ColaboradoresController.getAllActives);
router.get('/inativos', ColaboradoresController.getAllInactives);
router.get('/team', ColaboradoresController.getTeam);
router.get('/:id', ColaboradoresController.getById);
router.post('/', ColaboradoresController.create);
router.put('/:id', ColaboradoresController.update);
router.delete('/:id', ColaboradoresController.delete);
router.put('/:id/mark-inactive', ColaboradoresController.markAsInactive);

export default router; // Exporta o roteador
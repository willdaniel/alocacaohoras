// In: /routes/dashboardRouter.js

import { Router } from 'express';
import dashboardController from '../controllers/dashboardController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

// Aplica o middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Defines the dashboard endpoint
router.get('/dashboard/vencimentos', dashboardController.getDashboardData);
router.get('/dashboard/totalMonthlyHours', dashboardController.getTotalMonthlyHours);

export default router;
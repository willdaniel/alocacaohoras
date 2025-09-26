import express from 'express';
import relatoriosController from '../controllers/relatoriosController.js';
// You'll likely need your authentication middleware here to get user info.
// import authMiddleware from '../middleware/auth.js'; 

const router = express.Router();

// The error likely happened on a line like this, due to a typo or incorrect method signature:
// router.get('/allocations', relatoriosController.someNonExistentMethod);

// Corrected version:
router.get('/alocacoes', /* authMiddleware, */ relatoriosController.generateAllocationsReport);

export default router;
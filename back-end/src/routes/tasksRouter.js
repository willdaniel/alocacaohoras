import express from 'express';
const router = express.Router();
import * as tasksController from '../controllers/tasksController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

router.use(authMiddleware);

router.get('/', tasksController.getTasks);
router.post('/', tasksController.createTask);
router.put('/:id', tasksController.updateTask);
router.delete('/:id', tasksController.deleteTask);

export default router;
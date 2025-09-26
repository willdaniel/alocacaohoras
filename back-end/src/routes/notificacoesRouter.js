import express from 'express';
import * as notificacoesController from '../controllers/notificacoesController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET all news
router.get('/', authMiddleware, notificacoesController.getAllNews);

// GET single news by ID
router.get('/:id', notificacoesController.getNewsById);

// POST create new news
router.post('/', notificacoesController.createNews);

// PUT update news
router.put('/:id', notificacoesController.updateNews);

// DELETE news
router.delete('/:id', notificacoesController.deleteNews);

// DOWNLOAD file
router.get('/download/:fileName', notificacoesController.downloadFile);

export default router;
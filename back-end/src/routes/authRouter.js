import { Router } from 'express';
import AuthService from '../services/authService.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();
const authService = new AuthService();

router.post('/login', async (req, res, next) => {
  try {
    const { email, senha } = req.body;
    const { token, user } = await authService.login(email, senha);
    res.json({ token, user });
  } catch (error) {
    if (error.message === "Seu acesso está restrito. Contate o administrador.") {
      return res.status(403).json({ message: error.message });
    }
    if (error.message === "E-mail ou Senha incorretos") {
      return res.status(401).json({ message: error.message });
    }
    next(error);
  }
});

router.post('/forgot-password', async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'O e-mail é obrigatório.' });
  }

  try {
    const result = await authService.forgotPassword(email);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Erro interno do servidor.' });
  }
});

router.post('/reset-password', async (req, res, next) => {
  const { token, newPassword } = req.body;
  try {
    const result = await authService.resetPassword(token, newPassword);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const user = await authService.getUserDetails(req.user.userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;
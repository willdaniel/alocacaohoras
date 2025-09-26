// authController.js - VERSÃO FINAL E CORRIGIDA

import AuthService from "../services/authService.js";

const authService = new AuthService();

class AuthController {
  async login(req, res) {
    const { email, senha } = req.body;

    try {
      if (!email || !senha) {
        return res.status(400).json({ message: "Email e senha são obrigatórios" });
      }

      const { token, user } = await authService.login(email, senha);

      return res.status(200).json({
        message: "Login bem-sucedido",
        token,
        user
      });

    } catch (error) {
      console.error("[ERRO NO LOGIN]:", error.message);

      // Se a mensagem for de acesso restrito, status 403 (Proibido)
      if (error.message.includes("acesso está restrito")) {
        return res.status(403).json({ message: error.message });
      }
      
      // Se a mensagem for de credenciais inválidas, status 401 (Não Autorizado)
      if (error.message.includes("Email ou Senha Incorretos")) {
        return res.status(401).json({ message: error.message });
      }

      // Para qualquer outro erro inesperado, status 500 (Erro Interno)
      return res.status(500).json({ message: "Email ou Senha Incorretos." });
    }
  }

  async getUserDetails(req, res) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: "Usuário não autenticado" });
      }
      const user = await authService.getUserDetails(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      return res.status(200).json({ user });
    } catch (error) {
      console.error("Erro ao buscar detalhes do usuário:", error.message);
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new AuthController();
import UsuariosService from "../services/usuariosService.js";

class UsuariosController {
  constructor() {
    this.service = UsuariosService;
  }

  getAll = async (req, res) => {
    try {
      const result = await this.service.getAll();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.service.getById(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.message === "Usuário não encontrado" ? 404 : 500).json({ message: error.message });
    }
  };

  create = async (req, res) => {
    try {
      const result = await this.service.create(req.body);
      res.status(201).json({ message: "Usuário criado com sucesso", result });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      await this.service.update(id, req.body);
      res.status(200).json({ message: "Usuário atualizado com sucesso" });
    } catch (error) {
      res.status(error.message === "Usuário não encontrado" ? 404 : 500).json({ message: error.message });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      res.status(200).json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
      res.status(error.message === "Usuário não encontrado" ? 404 : 500).json({ message: error.message });
    }
  };

  getManagers = async (req, res) => {
    try {
      const result = await this.service.getManagers(req.user);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}

export default new UsuariosController();

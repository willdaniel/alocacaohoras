import RelatoriosService from '../services/relatoriosService.js';

const relatoriosService = new RelatoriosService();

class RelatoriosController {
  constructor() {
    // Bind methods to ensure `this` context is correct when passed to Express
    this.generateAllocationsReport = this.generateAllocationsReport.bind(this);
  }

  async generateAllocationsReport(req, res, next) {
    try {
      const { format } = req.query;
      // Assuming user info is available from an auth middleware, e.g., req.user
      const { userId, role } = req.user;

      if (!format || (format !== 'xlsx' && format !== 'csv')) {
        return res.status(400).json({ message: "Formato de relatório inválido. Use 'xlsx' ou 'csv'." });
      }

      const buffer = await relatoriosService.generateAllocationsReport({ format, userId, role });

      if (format === 'xlsx') {
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=relatorio_alocacoes.xlsx');
      } else {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=relatorio_alocacoes.csv');
      }

      res.send(buffer);
    } catch (error) {
      next(error);
    }
  }
}

export default new RelatoriosController();
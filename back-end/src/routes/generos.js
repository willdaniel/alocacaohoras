// routes/generos.js
import { Router } from 'express';
import db from '../db.js'; // Ajuste o caminho conforme sua estrutura

const router = Router();

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT id, nome FROM generos ORDER BY nome'); // Verifique se o nome da tabela está correto (generos/genero)
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar gêneros', error: error.message });
  }
});

export default router;

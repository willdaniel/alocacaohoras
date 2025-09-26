import './src/config/env.js';

import express from 'express';
import cors from 'cors';

// Importe todas as rotas
import { colunas } from './src/config/tabelas.js';
import colaboradoresRouter from './src/routes/colaboradoresRouter.js';
import cadastroRouter from './src/routes/cadastroRouter.js';
import usuariosRouter from './src/routes/usuariosRouter.js';
import authRouter from './src/routes/authRouter.js';
import aniversariantesRouter from './src/routes/aniversariantesRouter.js';
import crachasRouter from './src/routes/crachasRouter.js';
import pcmsoRouter from './src/routes/pcmsoRouter.js';
import pgrRouter from './src/routes/pgrRouter.js';
import cnhRouter from './src/routes/cnhRouter.js';
import examesRouter from './src/routes/examesRouter.js';
import integracoesRouter from './src/routes/integracoesRouter.js';
import salariosRouter from './src/routes/salariosRouter.js';
import admissoesRouter from './src/routes/admissoesRouter.js';
import demissoesRouter from './src/routes/demissoesRouter.js';
import cpstRouter from './src/routes/cpstRouter.js';
import totalSalariosRouter from './src/routes/totalSalariosRouter.js';
import normasRouter from './src/routes/normasRouter.js';
import dashboardRouter from './src/routes/dashboardRouter.js';
import relatoriosRouter from './src/routes/relatoriosRouter.js';
import orcamentosRouter from './src/routes/orcamentosRouter.js';
import alocacoesRouter from './src/routes/alocacoesRouter.js';
import tasksRouter from './src/routes/tasksRouter.js';
import nfsRouter from './src/routes/nfsRouter.js';
import solicitacoesRouter from './src/routes/solicitacoesRouter.js';
import notificacoesRouter from './src/routes/notificacoesRouter.js';


const app = express();

// Opcional: log das variáveis de ambiente carregadas
console.log('Configuração do banco:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  credentials: true // Caso precise de credenciais (cookies, etc.)
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' })); // Middleware para parsear JSON com limite de 50mb
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/api/notificacoes/images', express.static('D:\\storage\\images'));
app.use('/api/notificacoes/files', express.static('D:\\storage\\files'));

// Configuração das rotas

// módulo colaboradores
app.use('/api/colaboradores', colaboradoresRouter);
app.use('/api/bancos', cadastroRouter('bancos', colunas.cadastros));
app.use('/api/clientes', cadastroRouter('clientes', colunas.clientes));
app.use('/api/contratos', cadastroRouter('contratos', colunas.cadastros));
app.use('/api/disciplinas', cadastroRouter('disciplinas', colunas.disciplinas));
app.use('/api/generos', cadastroRouter('generos', colunas.cadastros));
app.use('/api/motivos', cadastroRouter('motivos_demissao', colunas.cadastros));
app.use('/api/pagamentos', cadastroRouter('pagamentos', colunas.cadastros));
app.use('/api/permissoes', cadastroRouter('permissoes', colunas.cadastros));
app.use('/api/usuarios', usuariosRouter);
app.use('/api/auth', authRouter);
app.use('/api/admissoes', admissoesRouter);
app.use('/api/demissoes', demissoesRouter);
app.use('/api/historico_salarios', salariosRouter);

//app.use('/api/integracoes', cadastroRouter('integracoes', colunas.integracoes));

app.use('/api/aniversariantes', aniversariantesRouter);
app.use('/api/crachas', crachasRouter);
app.use('/api/pcmso', pcmsoRouter);
app.use('/api/pgr', pgrRouter);
app.use('/api/cnh', cnhRouter);
app.use('/api/exames', examesRouter);
app.use('/api/salarios', salariosRouter);
app.use('/api/integracoes', integracoesRouter);
app.use('/api/cpst', cpstRouter);
app.use('/api/nrs', normasRouter);
app.use('/api', dashboardRouter);
app.use('/api/relatorios', relatoriosRouter);
app.use('/api/orcamentos', orcamentosRouter);
app.use('/api/alocacoes', alocacoesRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/nfs', nfsRouter);
app.use('/api/solicitacoes', solicitacoesRouter);
app.use('/api/notificacoes', notificacoesRouter);


app.get('/api/ping', (req, res) => {
  res.json({ message: "Servidor está rodando!" });
});

// Middleware de tratamento de erro global (DEVE SER O ÚLTIMO A SER REGISTRADO)
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err.message);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Erro interno no servidor'
  });
});

// Inicia o servidor na porta configurada no .env
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`API online na porta ${PORT}`));

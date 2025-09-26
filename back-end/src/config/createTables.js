import pool from '../repositories/db.js';

const createTables = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS solicitacoes (
        id SERIAL PRIMARY KEY,
        tipo VARCHAR(255) NOT NULL,
        data_inicio TIMESTAMP,
        data_fim TIMESTAMP,
        solicitante_id INTEGER REFERENCES colaboradores(id) ON DELETE CASCADE,
        gestor_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'aguardando',
        data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        aprovado_em TIMESTAMP WITH TIME ZONE
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS notificacoes (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        tipo VARCHAR(255) NOT NULL,
        mensagem TEXT NOT NULL,
        link VARCHAR(255),
        lida BOOLEAN DEFAULT false,
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Tabelas "solicitacoes" e "notificacoes" criadas com sucesso ou já existentes.');
  } catch (error) {
    console.error('Erro ao criar as tabelas:', error);
  } finally {
    client.release();
    pool.end();
  }
};

createTables();

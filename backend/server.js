'use strict';
require('dotenv').config();
const app = require('./src/app');
const { pool } = require('./src/config/database');
const config = require('./src/config/config');
const logger = require('./src/utils/logger');

const PORT = config.port;

async function start() {
  // Test DB connection before starting
  try {
    await pool.query('SELECT 1');
    logger.info('PostgreSQL connection verified');
  } catch (err) {
    logger.error('Failed to connect to PostgreSQL. Check DB_* env vars.', { error: err.message });
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT} [${config.env}]`);
  });

  // Graceful shutdown
  const shutdown = async (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await pool.end();
      logger.info('Server and DB pool closed.');
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (err) => {
    logger.error('Unhandled promise rejection', { error: err?.message || err });
  });
}

start();

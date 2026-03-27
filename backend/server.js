'use strict';
require('dotenv').config();
const app = require('./src/app');
const { pool } = require('./src/config/database');
const config = require('./src/config/config');
const logger = require('./src/utils/logger');

const PORT = config.port;

async function start() {
  // Start listening first so the platform health check can reach the port
  const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server running on http://0.0.0.0:${PORT} [${config.env}]`);
  });

  // Verify DB connection after the server is already accepting requests
  try {
    await pool.query('SELECT 1');
    logger.info('PostgreSQL connection verified');
  } catch (err) {
    logger.error('Failed to connect to PostgreSQL. Check DB_* env vars.', { error: err.message });
    // Do not exit — let the process stay alive so health checks keep passing
    // and the DB can recover (e.g. managed DB provisioning delay)
  }

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

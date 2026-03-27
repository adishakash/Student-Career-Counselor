'use strict';
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const config = require('./config/config');
const { generalLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Routes
const studentsRouter = require('./routes/students');
const paymentsRouter = require('./routes/payments');
const questionnaireRouter = require('./routes/questionnaire');
const reportsRouter = require('./routes/reports');

const app = express();

// ─── Security headers ────────────────────────────────────────
app.use(helmet());

// ─── CORS ────────────────────────────────────────────────────
app.use(
  cors({
    origin: [config.frontendUrl],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ─── Request parsing ─────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: false }));

// ─── Logging ─────────────────────────────────────────────────
app.use(
  morgan('combined', {
    stream: { write: (msg) => logger.info(msg.trim()) },
    skip: (req) => req.path === '/api/health',
  })
);

// ─── Static PDF serving ──────────────────────────────────────
// PDFs are served under /pdfs/:filename
// In production, consider moving this to a CDN or object storage
app.use('/pdfs', express.static(path.resolve(config.pdf.storagePath)));

// ─── Rate limiting (global) ───────────────────────────────────
app.use('/api', generalLimiter);

// ─── API Routes ───────────────────────────────────────────────
app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: config.env })
);

app.use('/api/students', studentsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/questionnaire', questionnaireRouter);
app.use('/api/reports', reportsRouter);

// ─── 404 + Error handler ─────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;

'use strict';
require('dotenv').config();

// Build db config — prefer DATABASE_URL (DigitalOcean managed DB) over individual vars
function buildDbConfig() {
  if (process.env.DATABASE_URL) {
    // Strip sslmode from the connection string so the pool-level ssl option
    // is the sole authority. DigitalOcean URLs often include ?sslmode=require
    // or ?sslmode=verify-full, which pg parses and uses to set
    // rejectUnauthorized: true, overriding our { rejectUnauthorized: false }.
    const dbUrl = new URL(process.env.DATABASE_URL);
    dbUrl.searchParams.delete('sslmode');
    return {
      connectionString: dbUrl.toString(),
      ssl: { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };
  }
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'student_career_counselor',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  };
}

// Support comma-separated FRONTEND_URL for multiple allowed origins
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((u) => u.trim())
  .filter(Boolean);

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  allowedOrigins,

  db: buildDbConfig(),

  jwt: {
    secret: process.env.JWT_SECRET || 'dev_jwt_secret_change_in_production',
    upgradeTokenSecret: process.env.UPGRADE_TOKEN_SECRET || 'dev_upgrade_secret_change_in_production',
    upgradeTokenExpiryDays: parseInt(process.env.UPGRADE_TOKEN_EXPIRY_DAYS, 10) || 30,
  },

  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    paidReportAmount: parseInt(process.env.PAID_REPORT_AMOUNT, 10) || 49900, // paise
  },

  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    fromName: process.env.EMAIL_FROM_NAME || 'Akash Universal Solutions',
    fromAddress: process.env.EMAIL_FROM_ADDRESS || 'adish@akashuniversalsolutions.com',
  },

  llm: {
    provider: process.env.LLM_PROVIDER || 'static',
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      model: process.env.OPENAI_MODEL || 'gpt-4o',
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
    },
    gemini: {
      apiKey: process.env.GEMINI_API_KEY || '',
      model: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
    },
  },

  pdf: {
    storagePath: process.env.PDF_STORAGE_PATH || './storage/pdfs',
    baseUrl: process.env.PDF_BASE_URL || 'http://localhost:5000/pdfs',
  },

  company: {
    name: 'CAD Gurukul',
    email: 'contact@cadgurukul.com',
    address: 'India',
    website: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
};

module.exports = config;

const db = require('./src/config/database');

async function runMigration() {
  try {
    await db.query(`
      ALTER TABLE assessments
      ADD COLUMN IF NOT EXISTS language VARCHAR(5) NOT NULL DEFAULT 'en'
      CHECK (language IN ('en', 'hi'))
    `);
    console.log('Migration completed: Added language column to assessments table');
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

runMigration();
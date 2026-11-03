import fs from 'fs';
import path from 'path';
import { db } from './client';

async function migrate() {
  console.log('🔄 Running FoodLens PostgreSQL migrations...');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL is not set in backend/.env');
    process.exit(1);
  }

  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    await db.query(sql);
    console.log('✅ Tables created successfully (products, ingredients, scan_history, chat_sessions).');
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await db.end();
  }
}

migrate();


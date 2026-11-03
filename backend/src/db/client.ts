import 'dotenv/config';
import { Pool } from 'pg';

const isProductionOrCloud = 
  process.env.DATABASE_URL?.includes('supabase') || 
  process.env.DATABASE_URL?.includes('neon') ||
  process.env.NODE_ENV === 'production';

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProductionOrCloud ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

db.on('error', (err) => {
  console.error('Unexpected database error', err);
});



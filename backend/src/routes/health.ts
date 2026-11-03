import { Router } from 'express';
import { db } from '../db/client';

export const healthRouter = Router();

healthRouter.get('/', async (_req, res) => {
  let dbOk = false;
  try {
    await db.query('SELECT 1');
    dbOk = true;
  } catch {}

  res.json({
    status: dbOk ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    services: {
      api: 'ok',
      database: dbOk ? 'ok' : 'unavailable',
    },
  });
});


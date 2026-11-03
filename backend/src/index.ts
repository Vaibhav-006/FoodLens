import 'dotenv/config';
import dns from 'node:dns';

// Ensure fast IPv4 resolution on Windows to avoid TLS/API timeouts
dns.setDefaultResultOrder('ipv4first');

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { barcodeRouter } from './routes/barcode';
import { productRouter } from './routes/product';
import { compareRouter } from './routes/compare';
import { aiRouter } from './routes/ai';
import { healthRouter } from './routes/health';

const app = express();
const PORT = process.env.PORT ?? 4000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',  // Next.js dev
    'https://foodlens.vercel.app',
    process.env.FRONTEND_URL ?? '',
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());

// Rate limiting: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/health', healthRouter);
app.use('/api/barcode', barcodeRouter);
app.use('/api/product', productRouter);
app.use('/api/compare', compareRouter);
app.use('/api/ai', aiRouter);

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 FoodLens API running on http://localhost:${PORT}`);
});

export default app;


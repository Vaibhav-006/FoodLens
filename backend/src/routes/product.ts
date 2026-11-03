import { Router } from 'express';
import { db } from '../db/client';
import { searchProducts } from '../services/barcodeResolver';

export const productRouter = Router();

// GET /api/product/search?q=...
productRouter.get('/search', async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) {
    return res.status(400).json({ success: false, error: 'Query parameter q is required' });
  }

  try {
    const products = await searchProducts(q);
    return res.json({ success: true, data: products });
  } catch (err) {
    console.error('[product/search]', err);
    return res.status(500).json({ success: false, error: 'Search failed' });
  }
});

// GET /api/product/history/:userId
productRouter.get('/history/:userId', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT p.*, sh.scanned_at
       FROM scan_history sh
       JOIN products p ON p.id = sh.product_id
       WHERE sh.user_id = $1
       ORDER BY sh.scanned_at DESC
       LIMIT 20`,
      [req.params.userId]
    );
    return res.json({ success: true, data: result.rows });
  } catch {
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/product/:id
productRouter.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch {
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

import { Router } from 'express';
import { z } from 'zod';
import { resolveBarcode } from '../services/barcodeResolver';
import { compareProducts } from '../services/comparisonEngine';

export const compareRouter = Router();

const compareSchema = z.object({
  barcodes: z.array(z.string().min(8).max(14)).min(2).max(3),
});

// POST /api/compare
compareRouter.post('/', async (req, res) => {
  const parsed = compareSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: 'Send 2-3 valid barcodes' });
  }

  try {
    const products = await Promise.all(
      parsed.data.barcodes.map((b) => resolveBarcode(b))
    );

    const found = products.filter(Boolean);
    if (found.length < 2) {
      return res.status(404).json({
        success: false,
        error: 'At least 2 products must be found to compare',
      });
    }

    const result = compareProducts(found as NonNullable<typeof products[0]>[]);
    return res.json({ success: true, data: result });
  } catch (err) {
    console.error('[compare]', err);
    return res.status(500).json({ success: false, error: 'Comparison failed' });
  }
});


import { Router } from 'express';
import { z } from 'zod';
import { resolveBarcode } from '../services/barcodeResolver';
import { enrichIngredients } from '../services/ingredientEngine';
import { scoreNutrition, computeOverallScore } from '@foodlens/core';

export const barcodeRouter = Router();

const scanSchema = z.object({
  barcode: z.string().min(8).max(14),
});

// POST /api/barcode/scan
barcodeRouter.post('/scan', async (req, res) => {
  const parsed = scanSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: 'Invalid barcode format' });
  }

  const { barcode } = parsed.data;

  try {
    const product = await resolveBarcode(barcode);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found. Try entering ingredients manually.',
        code: 'PRODUCT_NOT_FOUND',
      });
    }

    // Enrich ingredients with profiles
    const enrichedIngredients = await enrichIngredients(product.ingredients);
    const nutrientScores = scoreNutrition(product.nutritionPer100g);
    const overallScore = computeOverallScore(product.nutritionPer100g);

    return res.json({
      success: true,
      data: {
        product: { ...product, ingredients: enrichedIngredients },
        nutrientScores,
        overallScore,
      },
    });
  } catch (err) {
    console.error('[barcode/scan]', err);
    return res.status(500).json({ success: false, error: 'Failed to resolve barcode' });
  }
});

// GET /api/barcode/:barcode  (quick lookup, no enrichment)
barcodeRouter.get('/:barcode', async (req, res) => {
  const { barcode } = req.params;
  if (!barcode || barcode.length < 8) {
    return res.status(400).json({ success: false, error: 'Invalid barcode' });
  }

  try {
    const product = await resolveBarcode(barcode);
    if (!product) return res.status(404).json({ success: false, error: 'Not found' });
    return res.json({ success: true, data: product });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});


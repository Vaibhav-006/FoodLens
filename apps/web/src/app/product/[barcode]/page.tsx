import { notFound } from 'next/navigation';
import { ScanResultView } from '@/components/ScanResultView';
import { resolveBarcode } from '@/../../backend/src/services/barcodeResolver';
import { enrichIngredients } from '@/../../backend/src/services/ingredientEngine';
import { scoreNutrition, computeOverallScore } from '@foodlens/core';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

async function getProductData(barcode: string) {
  // 1. First try backend API if running
  try {
    const res = await fetch(`${API}/api/barcode/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ barcode }),
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success) return json.data;
    }
  } catch {}

  // 2. Direct server-side resolution fallback (guarantees zero failure on static/server render)
  try {
    const product = await resolveBarcode(barcode);
    if (!product) return null;

    const enriched = await enrichIngredients(product.ingredients);
    const nutrientScores = scoreNutrition(product.nutritionPer100g);
    const overallScore = computeOverallScore(product.nutritionPer100g);

    return {
      product: { ...product, ingredients: enriched },
      nutrientScores,
      overallScore,
    };
  } catch {
    return null;
  }
}

export default async function ProductPage({ params }: { params: Promise<{ barcode: string }> }) {
  const { barcode } = await params;
  const data = await getProductData(barcode);
  if (!data) notFound();

  const { product, nutrientScores, overallScore } = data;

  return (
    <ScanResultView
      product={product}
      nutrientScores={nutrientScores}
      overallScore={overallScore}
    />
  );
}

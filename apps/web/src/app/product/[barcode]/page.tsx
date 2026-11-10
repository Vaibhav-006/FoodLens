import { notFound } from 'next/navigation';
import { ScanResultView } from '@/components/ScanResultView';
import {
  findInCatalog,
  fetchFromOpenFoodFacts,
  scoreNutrition,
  computeOverallScore,
  sanitizeNutrition,
} from '@foodlens/core';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

async function getProductData(barcode: string) {
  const cleaned = barcode?.trim();
  if (!cleaned) return null;

  // 1. Instant hit from Curated Popular Catalog (0ms latency, zero network)
  try {
    const catalogLookup = typeof findInCatalog === 'function' ? findInCatalog : null;
    const catalogHit = catalogLookup ? catalogLookup(cleaned) : null;
    if (catalogHit) {
      const cleanNutrition = sanitizeNutrition(catalogHit.nutritionPer100g);
      const product = { ...catalogHit, nutritionPer100g: cleanNutrition };
      const nutrientScores = scoreNutrition(cleanNutrition);
      const overallScore = computeOverallScore(cleanNutrition);
      return {
        product,
        nutrientScores,
        overallScore,
      };
    }
  } catch (err) {
    console.error('Error checking catalog:', err);
  }

  // 2. Try backend API if URL is configured or in local development
  if (process.env.NEXT_PUBLIC_API_URL || process.env.NODE_ENV === 'development') {
    try {
      const res = await fetch(`${API}/api/barcode/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode: cleaned }),
        signal: AbortSignal.timeout(1200),
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const rawProduct = json.data.product;
          if (rawProduct) {
            const cleanNutrition = sanitizeNutrition(rawProduct.nutritionPer100g);
            const product = { ...rawProduct, nutritionPer100g: cleanNutrition };
            const nutrientScores = scoreNutrition(cleanNutrition);
            const overallScore = computeOverallScore(cleanNutrition);
            return {
              product,
              nutrientScores,
              overallScore,
            };
          }
        }
      }
    } catch {}
  }

  // 3. Fallback to Open Food Facts API directly
  try {
    const product = await fetchFromOpenFoodFacts(cleaned);
    if (!product) return null;

    const cleanNutrition = sanitizeNutrition(product.nutritionPer100g);
    const cleanProduct = { ...product, nutritionPer100g: cleanNutrition };
    const nutrientScores = scoreNutrition(cleanNutrition);
    const overallScore = computeOverallScore(cleanNutrition);

    return {
      product: cleanProduct,
      nutrientScores,
      overallScore,
    };
  } catch (err) {
    console.error('Error fetching OpenFoodFacts:', err);
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

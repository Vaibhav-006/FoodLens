import { notFound } from 'next/navigation';
import { ScanResultView } from '@/components/ScanResultView';
import {
  findInCatalog,
  fetchFromOpenFoodFacts,
  scoreNutrition,
  computeOverallScore,
} from '@foodlens/core';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

async function getProductData(barcode: string) {
  const cleaned = barcode?.trim();
  if (!cleaned) return null;

  // 1. Instant hit from Curated Popular Catalog (0ms latency, zero network)
  try {
    const catalogHit = findInCatalog(cleaned);
    if (catalogHit) {
      const nutrientScores = scoreNutrition(catalogHit.nutritionPer100g);
      const overallScore = computeOverallScore(catalogHit.nutritionPer100g);
      return {
        product: catalogHit,
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
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch {}
  }

  // 3. Fallback to Open Food Facts API directly
  try {
    const product = await fetchFromOpenFoodFacts(cleaned);
    if (!product) return null;

    const nutrientScores = scoreNutrition(product.nutritionPer100g);
    const overallScore = computeOverallScore(product.nutritionPer100g);

    return {
      product,
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

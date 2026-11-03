import type { Product, ComparisonResult } from '@foodlens/core';
import { scoreNutrition, computeOverallScore } from '@foodlens/core';

export function compareProducts(products: Product[]): ComparisonResult {
  if (products.length < 2) throw new Error('Need at least 2 products to compare');
  if (products.length > 3) throw new Error('Maximum 3 products can be compared');

  const nutrientScores: Record<string, ReturnType<typeof scoreNutrition>> = {};
  const overallScores: Record<string, number> = {};

  for (const product of products) {
    nutrientScores[product.id] = scoreNutrition(product.nutritionPer100g);
    overallScores[product.id] = computeOverallScore(product.nutritionPer100g);
  }

  // Find winner (highest overall score)
  const winner = products.reduce((best, p) =>
    overallScores[p.id] > overallScores[best.id] ? p : best
  ).id;

  return { products, nutrientScores, overallScores, winner };
}


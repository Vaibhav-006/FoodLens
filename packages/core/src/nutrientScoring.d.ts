import type { NutritionFacts, NutrientScore } from './types';
export declare function scoreNutrition(nutrition: NutritionFacts): NutrientScore[];
/**
 * Returns an overall health score 0–100 (higher = healthier).
 * Penalises red nutrients, rewards green fibre/protein.
 */
export declare function computeOverallScore(nutrition: NutritionFacts): number;
//# sourceMappingURL=nutrientScoring.d.ts.map
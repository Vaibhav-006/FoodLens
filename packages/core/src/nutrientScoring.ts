import type { NutritionFacts, NutrientScore, TrafficLight } from './types';

// ─── WHO / FSSAI / ICMR daily reference values (for adults, per 2000 kcal diet) ─────
const DAILY_VALUES: Partial<Record<keyof NutritionFacts, number>> = {
  calories: 2000,      // kcal
  totalFat: 65,        // g (20-30% of daily energy)
  saturatedFat: 20,    // g (WHO: <10% of energy)
  transFat: 2,         // g (WHO: <1% of energy ≈ 2g)
  totalCarbs: 300,     // g
  dietaryFibre: 30,    // g (ICMR-NIN 2020 RDA: 30g/day)
  totalSugar: 50,      // g (WHO: <10% of energy)
  addedSugar: 25,      // g (WHO / ICMR: <25g/day free/added sugars)
  sodium: 2000,        // mg (WHO / FSSAI: <2000mg sodium = 5g salt)
  protein: 50,         // g (ICMR-NIN RDA: 50g-60g)
};

// Traffic light thresholds per 100g (FSSAI / UK FSA / WHO standards)
const THRESHOLDS: Partial<Record<keyof NutritionFacts, { green: number; amber: number }>> = {
  totalFat:      { green: 3,    amber: 17.5  },  // g per 100g
  saturatedFat:  { green: 1.5,  amber: 5     },  // g per 100g
  transFat:      { green: 0.1,  amber: 0.5   },  // g per 100g
  totalSugar:    { green: 5,    amber: 12.5  },  // g per 100g
  addedSugar:    { green: 2.5,  amber: 10    },  // g per 100g
  sodium:        { green: 120,  amber: 600   },  // mg per 100g (FSSAI HFSS threshold: >600mg)
  calories:      { green: 150,  amber: 350   },  // kcal per 100g
  protein:       { green: 10,   amber: 5     },  // g per 100g (>10g high protein, 5-10g good)
  dietaryFibre:  { green: 6,    amber: 3     },  // g per 100g (>6g high fibre, 3-6g good)
};

const UNITS: Partial<Record<keyof NutritionFacts, string>> = {
  calories: 'kcal',
  totalFat: 'g',
  saturatedFat: 'g',
  transFat: 'g',
  totalCarbs: 'g',
  dietaryFibre: 'g',
  totalSugar: 'g',
  addedSugar: 'g',
  protein: 'g',
  sodium: 'mg',
};

const LABELS: Partial<Record<keyof NutritionFacts, string>> = {
  calories: 'Calories',
  totalFat: 'Total Fat',
  saturatedFat: 'Saturated Fat',
  transFat: 'Trans Fat',
  totalCarbs: 'Total Carbohydrates',
  dietaryFibre: 'Dietary Fibre',
  totalSugar: 'Total Sugar',
  addedSugar: 'Added Sugar',
  protein: 'Protein',
  sodium: 'Sodium',
};

function getTrafficLight(nutrient: keyof NutritionFacts, value: number, isLiquid = false): TrafficLight {
  // Liquids have stricter sugar thresholds (FSA / UK: green <= 2.5g, amber <= 11.25g)
  if (nutrient === 'totalSugar' && isLiquid) {
    if (value <= 2.5) return 'green';
    if (value <= 8) return 'amber';
    return 'red';
  }

  // Positives: protein and fibre (higher is better)
  if (nutrient === 'protein' || nutrient === 'dietaryFibre') {
    const threshold = THRESHOLDS[nutrient];
    if (threshold && value >= threshold.green) return 'green';
    if (threshold && value >= threshold.amber) return 'green';
    return 'amber';
  }

  const threshold = THRESHOLDS[nutrient];
  if (!threshold) return 'green';
  if (value <= threshold.green) return 'green';
  if (value <= threshold.amber) return 'amber';
  return 'red';
}

export function scoreNutrition(nutrition: NutritionFacts): NutrientScore[] {
  const keys = Object.keys(nutrition) as (keyof NutritionFacts)[];
  const isLiquid = (nutrition.totalFat ?? 0) === 0 && (nutrition.protein ?? 0) === 0 && (nutrition.totalSugar ?? 0) > 0;

  return keys.map((nutrient) => {
    const value = nutrition[nutrient];
    const dv = DAILY_VALUES[nutrient];

    return {
      nutrient,
      valuePer100g: value,
      trafficLight: value !== null ? getTrafficLight(nutrient, value, isLiquid) : 'green',
      label: LABELS[nutrient] ?? nutrient,
      unit: UNITS[nutrient] ?? '',
      dailyValuePercent:
        value !== null && dv !== undefined
          ? Math.round((value / dv) * 100)
          : (value === 0 ? 0 : null),
    };
  });
}

/**
 * Returns an overall health score 0–100 (higher = healthier).
 * Penalises red nutrients, rewards green fibre/protein, and penalises free liquid sugars.
 */
export function computeOverallScore(nutrition: NutritionFacts): number {
  const scores = scoreNutrition(nutrition);
  let penalty = 0;
  let bonus = 0;

  for (const s of scores) {
    if (s.trafficLight === 'red') penalty += 18;
    if (s.trafficLight === 'amber') penalty += 8;
    if (s.nutrient === 'dietaryFibre' && (s.valuePer100g ?? 0) >= 3) bonus += 10;
    if (s.nutrient === 'protein' && (s.valuePer100g ?? 0) >= 5) bonus += 5;
    if (s.nutrient === 'transFat' && (s.valuePer100g ?? 0) > 0.5) penalty += 20;
  }

  const sugar = nutrition.totalSugar ?? 0;
  const fat = nutrition.totalFat ?? 0;
  const prot = nutrition.protein ?? 0;
  const fibre = nutrition.dietaryFibre ?? 0;

  // Liquid / Empty-calorie sugar penalty:
  // Pure sugary drinks (high sugar, 0 fat, 0 protein, 0 fibre)
  if (sugar >= 8 && fat === 0 && prot === 0 && fibre === 0) {
    penalty += 45; // Caps sugary sodas like Coca-Cola at ~30-35 (Nutri-Score E)
  } else if (sugar >= 25) {
    penalty += 15;
  }

  return Math.max(0, Math.min(100, 100 - penalty + bonus));
}

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

function getTrafficLight(nutrient: keyof NutritionFacts, rawValue: any, isLiquid = false): TrafficLight {
  if (rawValue === null || rawValue === undefined) return 'unknown';
  const value = Number(rawValue);
  if (isNaN(value)) return 'unknown';

  // Positives: protein and fibre (higher is better)
  if (nutrient === 'protein' || nutrient === 'dietaryFibre') {
    const threshold = THRESHOLDS[nutrient];
    if (threshold && value >= threshold.green) return 'green';
    if (threshold && value >= threshold.amber) return 'green';
    return 'amber';
  }

  // Liquids have stricter sugar thresholds (FSA / UK: green <= 2.5g, amber <= 8g)
  if (nutrient === 'totalSugar' && isLiquid) {
    if (value <= 2.5) return 'green';
    if (value <= 8) return 'amber';
    return 'red';
  }

  const threshold = THRESHOLDS[nutrient];
  if (!threshold) return 'green';
  if (value <= threshold.green) return 'green';
  if (value <= threshold.amber) return 'amber';
  return 'red';
}

/**
 * Sanitizes nutrition facts by stripping units (e.g. "7g", "135mg", "160 kcal")
 * and ensuring values are pure numbers or null.
 */
export function sanitizeNutrition(nutrition: any): NutritionFacts {
  const parseNum = (val: any): number | null => {
    if (val === null || val === undefined) return null;
    if (typeof val === 'number') return isNaN(val) ? null : val;
    const str = String(val).trim();
    if (!str || str === '—' || str.toLowerCase() === 'n/a' || str.toLowerCase() === 'null') return null;
    const match = str.match(/[-+]?[0-9]*\.?[0-9]+/);
    if (!match) return null;
    const n = parseFloat(match[0]);
    return isNaN(n) ? null : n;
  };

  return {
    calories: parseNum(nutrition?.calories),
    totalFat: parseNum(nutrition?.totalFat),
    saturatedFat: parseNum(nutrition?.saturatedFat),
    transFat: parseNum(nutrition?.transFat),
    totalCarbs: parseNum(nutrition?.totalCarbs),
    dietaryFibre: parseNum(nutrition?.dietaryFibre),
    totalSugar: parseNum(nutrition?.totalSugar),
    addedSugar: parseNum(nutrition?.addedSugar),
    protein: parseNum(nutrition?.protein),
    sodium: parseNum(nutrition?.sodium),
  };
}

export function scoreNutrition(rawNutrition: NutritionFacts): NutrientScore[] {
  const nutrition = sanitizeNutrition(rawNutrition);
  const keys = Object.keys(nutrition) as (keyof NutritionFacts)[];
  const isLiquid = (nutrition.totalFat ?? 0) === 0 && (nutrition.protein ?? 0) === 0 && (nutrition.totalSugar ?? 0) > 0;

  return keys.map((nutrient) => {
    const value = nutrition[nutrient];
    const dv = DAILY_VALUES[nutrient];

    let dvPct: number | null = null;
    if (value !== null && !isNaN(value) && dv !== undefined && dv > 0) {
      dvPct = Math.round((value / dv) * 100);
    }

    return {
      nutrient,
      valuePer100g: value,
      trafficLight: getTrafficLight(nutrient, value, isLiquid),
      label: LABELS[nutrient] ?? nutrient,
      unit: UNITS[nutrient] ?? '',
      dailyValuePercent: dvPct,
    };
  });
}

/**
 * Checks whether the product has meaningful nutrition facts reported.
 * Requires at least 2 primary macronutrients to be non-null and at least 1 non-zero.
 */
export function hasReportedNutrition(rawNutrition: NutritionFacts): boolean {
  if (!rawNutrition) return false;
  const nutrition = sanitizeNutrition(rawNutrition);
  let count = 0;
  let nonZeroCount = 0;
  const primary: (keyof NutritionFacts)[] = ['calories', 'totalFat', 'totalSugar', 'sodium', 'protein', 'totalCarbs'];
  for (const k of primary) {
    const val = nutrition[k];
    if (val !== null && val !== undefined && !isNaN(val)) {
      count++;
      if (val > 0) nonZeroCount++;
    }
  }
  return count >= 2 && nonZeroCount >= 1;
}

/**
 * Returns an overall health score 0–100 (higher = healthier).
 * If nutrition facts are missing / unpopulated, returns null (unrated / incomplete).
 * Penalises red nutrients, rewards green fibre/protein, and penalises free liquid sugars.
 */
export function computeOverallScore(rawNutrition: NutritionFacts): number | null {
  const nutrition = sanitizeNutrition(rawNutrition);
  if (!hasReportedNutrition(nutrition)) {
    return null;
  }

  const scores = scoreNutrition(nutrition);
  let penalty = 0;
  let bonus = 0;

  for (const s of scores) {
    if (s.nutrient === 'totalFat') {
      if (s.trafficLight === 'red') penalty += 10;
      else if (s.trafficLight === 'amber') penalty += 4;
    } else if (s.nutrient === 'saturatedFat') {
      if (s.trafficLight === 'red') penalty += 16;
      else if (s.trafficLight === 'amber') penalty += 6;
    } else if (s.nutrient === 'totalSugar') {
      if (s.trafficLight === 'red') penalty += 16;
      else if (s.trafficLight === 'amber') penalty += 6;
    } else if (s.nutrient === 'addedSugar') {
      if (s.trafficLight === 'red') penalty += 6;
    } else if (s.nutrient === 'sodium') {
      if (s.trafficLight === 'red') penalty += 14;
      else if (s.trafficLight === 'amber') penalty += 6;
    } else if (s.nutrient === 'calories') {
      if (s.trafficLight === 'red') penalty += 6;
      else if (s.trafficLight === 'amber') penalty += 2;
    }

    if (s.nutrient === 'dietaryFibre' && (s.valuePer100g ?? 0) >= 3) bonus += 8;
    if (s.nutrient === 'protein' && (s.valuePer100g ?? 0) >= 5) bonus += 6;
    if (s.nutrient === 'transFat' && (s.valuePer100g ?? 0) > 0.5) penalty += 15;
  }

  const sugar = nutrition.totalSugar ?? 0;
  const fat = nutrition.totalFat ?? 0;
  const prot = nutrition.protein ?? 0;
  const fibre = nutrition.dietaryFibre ?? 0;

  // Liquid sugary drinks penalty (high sugar, 0 fat, 0 protein, 0 fibre)
  if (sugar >= 8 && fat === 0 && prot === 0 && fibre === 0) {
    penalty += 28;
  } else if (sugar >= 30) {
    penalty += 10;
  }

  const rawScore = 100 - penalty + bonus;
  // Floor for packaged foods is 15
  return Math.max(15, Math.min(100, Math.round(rawScore)));
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoreNutrition = scoreNutrition;
exports.computeOverallScore = computeOverallScore;
// ─── WHO / FSSAI daily reference values (for adults, per 2000 kcal diet) ─────
const DAILY_VALUES = {
    calories: 2000,
    totalFat: 65, // g
    saturatedFat: 20, // g
    transFat: 2, // g  (WHO: <1% of energy ≈ 2g)
    totalCarbs: 300, // g
    dietaryFibre: 25, // g
    totalSugar: 50, // g  (WHO: <10% of energy)
    sodium: 2000, // mg (WHO: <2g/day)
    protein: 50, // g
};
// Traffic light thresholds per 100g (FSSAI / FSA UK model)
const THRESHOLDS = {
    totalFat: { green: 3, amber: 17.5 }, // g per 100g
    saturatedFat: { green: 1.5, amber: 5 },
    transFat: { green: 0.1, amber: 0.5 },
    totalSugar: { green: 5, amber: 12.5 },
    sodium: { green: 120, amber: 600 }, // mg per 100g
    calories: { green: 100, amber: 300 }, // kcal per 100g
};
const UNITS = {
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
const LABELS = {
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
function getTrafficLight(nutrient, value) {
    const threshold = THRESHOLDS[nutrient];
    if (!threshold)
        return 'green'; // fibre, protein — no red threshold
    if (value <= threshold.green)
        return 'green';
    if (value <= threshold.amber)
        return 'amber';
    return 'red';
}
function scoreNutrition(nutrition) {
    const keys = Object.keys(nutrition);
    return keys.map((nutrient) => {
        const value = nutrition[nutrient];
        const dv = DAILY_VALUES[nutrient];
        return {
            nutrient,
            valuePer100g: value,
            trafficLight: value !== null ? getTrafficLight(nutrient, value) : 'green',
            label: LABELS[nutrient] ?? nutrient,
            unit: UNITS[nutrient] ?? '',
            dailyValuePercent: value !== null && dv ? Math.round((value / dv) * 100) : null,
        };
    });
}
/**
 * Returns an overall health score 0–100 (higher = healthier).
 * Penalises red nutrients, rewards green fibre/protein.
 */
function computeOverallScore(nutrition) {
    const scores = scoreNutrition(nutrition);
    let penalty = 0;
    let bonus = 0;
    for (const s of scores) {
        if (s.trafficLight === 'red')
            penalty += 15;
        if (s.trafficLight === 'amber')
            penalty += 7;
        if (s.nutrient === 'dietaryFibre' && (s.valuePer100g ?? 0) >= 3)
            bonus += 10;
        if (s.nutrient === 'protein' && (s.valuePer100g ?? 0) >= 5)
            bonus += 5;
        if (s.nutrient === 'transFat' && (s.valuePer100g ?? 0) > 0.5)
            penalty += 20;
    }
    return Math.max(0, Math.min(100, 100 - penalty + bonus));
}
//# sourceMappingURL=nutrientScoring.js.map
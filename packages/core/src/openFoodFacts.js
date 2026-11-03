"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFromOpenFoodFacts = fetchFromOpenFoodFacts;
exports.parseIngredients = parseIngredients;
const OFF_BASE = 'https://world.openfoodfacts.org/api/v2/product';
/**
 * Fetch product data from Open Food Facts by barcode.
 * Returns null if not found.
 */
async function fetchFromOpenFoodFacts(barcode) {
    const url = `${OFF_BASE}/${barcode}.json?fields=product_name,brands,image_url,serving_size,nutriments,ingredients_text,nutriscore_grade`;
    const response = await fetch(url, {
        headers: { 'User-Agent': 'FoodLens/1.0 (contact@foodlens.app)' },
    });
    if (!response.ok)
        return null;
    const json = (await response.json());
    if (json.status !== 1 || !json.product)
        return null;
    const p = json.product;
    const n = p.nutriments ?? {};
    return {
        id: crypto.randomUUID(),
        barcode,
        name: p.product_name || 'Unknown Product',
        brand: p.brands || null,
        imageUrl: p.image_url || null,
        servingSizeG: parseFloat(p.serving_size) || null,
        nutriscore: p.nutriscore_grade || null,
        source: 'openfoodfacts',
        ingredientsRaw: p.ingredients_text || null,
        ingredients: parseIngredients(p.ingredients_text || ''),
        nutritionPer100g: {
            calories: n['energy-kcal_100g'] ?? null,
            totalFat: n['fat_100g'] ?? null,
            saturatedFat: n['saturated-fat_100g'] ?? null,
            transFat: n['trans-fat_100g'] ?? null,
            totalCarbs: n['carbohydrates_100g'] ?? null,
            dietaryFibre: n['fiber_100g'] ?? null,
            totalSugar: n['sugars_100g'] ?? null,
            addedSugar: n['added-sugars_100g'] ?? null,
            protein: n['proteins_100g'] ?? null,
            sodium: n['sodium_100g'] !== undefined ? n['sodium_100g'] * 1000 : null, // convert g→mg
        },
    };
}
/**
 * Parse a raw ingredients string into a list of ingredient names.
 * Example: "Potatoes, Edible Vegetable Oil, Salt, Acidity Regulator (330)"
 */
function parseIngredients(raw) {
    if (!raw.trim())
        return [];
    // Split by comma, strip quantities and parenthetical percentages
    return raw
        .split(/,(?![^(]*\))/) // split on commas outside parentheses
        .map((s) => s.trim().replace(/\s*\(\d+[\.,]?\d*%?\)/, '').trim())
        .filter(Boolean)
        .map((name) => {
        // Detect E-numbers like E471, E330 etc.
        const eMatch = name.match(/\bE\d{3,4}[a-z]?\b/i);
        return {
            name: name.replace(/\bE\d{3,4}[a-z]?\b/i, '').replace(/[()]/g, '').trim() || name,
            originalText: name,
            eNumber: eMatch ? eMatch[0].toUpperCase() : undefined,
        };
    });
}
//# sourceMappingURL=openFoodFacts.js.map
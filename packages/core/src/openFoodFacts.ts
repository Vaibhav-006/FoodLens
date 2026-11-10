import type { Product } from './types';

const OFF_BASE_V2 = 'https://world.openfoodfacts.org/api/v2/product';
const OFF_BASE_V0 = 'https://world.openfoodfacts.org/api/v0/product';
const OFF_SEARCH = 'https://world.openfoodfacts.org/cgi/search.pl';

const round1 = (val: any) =>
  val !== null && val !== undefined && !isNaN(Number(val))
    ? Math.round(Number(val) * 10) / 10
    : null;

function mapOFFProduct(p: any, fallbackBarcode: string): Product {
  const n = p.nutriments ?? {};
  const isVeg = p.ingredients_analysis_tags?.includes('en:non-vegetarian')
    ? false
    : p.ingredients_analysis_tags?.includes('en:vegetarian')
    ? true
    : !p.ingredients_text?.toLowerCase().match(/chicken|meat|gelatin|egg|fish|pork|beef/);

  return {
    id: crypto.randomUUID(),
    barcode: p.code || fallbackBarcode,
    name: p.product_name || p.product_name_en || 'Unknown Product',
    brand: p.brands || null,
    imageUrl: p.image_url || p.selected_images?.front?.display?.en || p.image_front_url || null,
    servingSizeG: parseFloat(p.serving_size) || parseFloat(p.serving_quantity) || null,
    nutriscore: p.nutriscore_grade || null,
    source: 'openfoodfacts',
    isVegetarian: isVeg,
    ingredientsRaw: p.ingredients_text || p.ingredients_text_en || null,
    ingredients: parseIngredients(p.ingredients_text || p.ingredients_text_en || ''),
    nutritionPer100g: {
      calories:     n['energy-kcal_100g'] ? Math.round(Number(n['energy-kcal_100g'])) : (n['energy_100g'] ? Math.round(Number(n['energy_100g']) / 4.184) : null),
      totalFat:     round1(n['fat_100g']),
      saturatedFat: round1(n['saturated-fat_100g']),
      transFat:     round1(n['trans-fat_100g']),
      totalCarbs:   round1(n['carbohydrates_100g']),
      dietaryFibre: round1(n['fiber_100g']),
      totalSugar:   round1(n['sugars_100g']),
      addedSugar:   round1(n['added-sugars_100g']),
      protein:      round1(n['proteins_100g']),
      sodium:       n['sodium_100g'] !== undefined ? Math.round(Number(n['sodium_100g']) * 1000) : (n['salt_100g'] !== undefined ? Math.round(Number(n['salt_100g']) * 400) : null),
    },
  };
}

async function tryFetchOFF(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'FoodLens/1.0 (contact@foodlens.app)' },
      signal: AbortSignal.timeout(3500),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as any;
    if (json.status === 1 && json.product && (json.product.product_name || json.product.product_name_en)) {
      return json.product;
    }
  } catch {}
  return null;
}

/**
 * Fetch product data from Open Food Facts by barcode.
 * Uses smart variations: exact code, unpadded leading zeros, 13-digit zero-padded EAN, and v0 endpoint.
 */
export async function fetchFromOpenFoodFacts(barcode: string): Promise<Product | null> {
  const cleaned = barcode.trim();
  const variations: string[] = [cleaned];

  // If starts with '0', try without '0'
  if (cleaned.startsWith('0')) {
    variations.push(cleaned.replace(/^0+/, ''));
  }
  // If 12 digits (UPC-A), try with leading 0 (EAN-13)
  if (cleaned.length === 12) {
    variations.push(`0${cleaned}`);
  }

  // 1. Try V2 endpoint with each variation
  for (const code of variations) {
    const fields = 'code,product_name,product_name_en,brands,image_url,image_front_url,serving_size,serving_quantity,nutriments,ingredients_text,ingredients_text_en,nutriscore_grade';
    const prod = await tryFetchOFF(`${OFF_BASE_V2}/${code}.json?fields=${fields}`);
    if (prod) return mapOFFProduct(prod, cleaned);
  }

  // 2. Try V0 endpoint
  for (const code of variations) {
    const prod = await tryFetchOFF(`${OFF_BASE_V0}/${code}.json`);
    if (prod) return mapOFFProduct(prod, cleaned);
  }

  // 3. Try Search API by barcode
  try {
    const searchUrl = `${OFF_SEARCH}?search_terms=${encodeURIComponent(cleaned)}&search_simple=1&action=process&json=1&page_size=1`;
    const res = await fetch(searchUrl, {
      headers: { 'User-Agent': 'FoodLens/1.0 (contact@foodlens.app)' },
    });
    if (res.ok) {
      const data = (await res.json()) as any;
      if (data.products && data.products.length > 0 && data.products[0].product_name) {
        return mapOFFProduct(data.products[0], cleaned);
      }
    }
  } catch {}

  return null;
}

/**
 * Search products on Open Food Facts by name (e.g. "Kurkure", "Lays", "Good Day")
 */
export async function searchOpenFoodFactsByName(query: string): Promise<Product[]> {
  try {
    const searchUrl = `${OFF_SEARCH}?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=10`;
    const res = await fetch(searchUrl, {
      headers: { 'User-Agent': 'FoodLens/1.0 (contact@foodlens.app)' },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as any;
    if (!data.products) return [];

    return data.products
      .filter((p: any) => p.product_name || p.product_name_en)
      .map((p: any) => mapOFFProduct(p, p.code || ''));
  } catch {
    return [];
  }
}

/**
 * Parse a raw ingredients string into a list of ingredient names.
 * Example: "Potatoes, Edible Vegetable Oil, Salt, Acidity Regulator (330)"
 */
export function parseIngredients(raw: string) {
  if (!raw || !raw.trim()) return [];

  return raw
    .split(/,(?![^(]*\))/)   // split on commas outside parentheses
    .map((s) => s.trim().replace(/\s*\(\d+[\.,]?\d*%?\)/, '').trim())
    .filter(Boolean)
    .map((name) => {
      // Detect E-numbers or INS numbers like E471, INS 330, 330
      const eMatch = name.match(/\b(E|INS\s*)\d{3,4}[a-z]?\b/i) || name.match(/\b\d{3,4}[a-z]?\b/);
      let eNum: string | undefined = undefined;
      if (eMatch) {
        const rawNum = eMatch[0].replace(/INS\s*/i, '').replace(/E/i, '').trim();
        eNum = `E${rawNum}`;
      }
      return {
        name: name.replace(/\b(E|INS\s*)\d{3,4}[a-z]?\b/ig, '').replace(/[()]/g, '').trim() || name,
        originalText: name,
        eNumber: eNum,
      };
    });
}

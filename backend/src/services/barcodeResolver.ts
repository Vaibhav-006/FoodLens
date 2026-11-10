import { fetchFromOpenFoodFacts, searchOpenFoodFactsByName, sanitizeNutrition } from '@foodlens/core';
import type { Product } from '@foodlens/core';
import { db } from '../db/client';
import { cache, CACHE_TTL } from '../lib/cache';
import { POPULAR_SNACKS_CATALOG, BARCODE_ALIASES } from '../data/productsCatalog';
import { generateProductWithAI } from './aiAssistant';

function findInCatalog(barcode: string): Product | null {
  const cleaned = barcode.trim();

  // 1. Check exact barcode in catalog
  const direct = POPULAR_SNACKS_CATALOG.find((p) => p.barcode === cleaned);
  if (direct) return direct;

  // 2. Check alias map
  const targetId = BARCODE_ALIASES[cleaned];
  if (targetId) {
    const found = POPULAR_SNACKS_CATALOG.find((p) => p.id === targetId);
    if (found) return { ...found, barcode: cleaned };
  }

  // 3. Try variations (strip leading 0 or pad 0)
  const unpadded = cleaned.replace(/^0+/, '');
  const padded = cleaned.length === 12 ? `0${cleaned}` : cleaned;

  for (const alt of [unpadded, padded]) {
    const altTarget = BARCODE_ALIASES[alt];
    if (altTarget) {
      const found = POPULAR_SNACKS_CATALOG.find((p) => p.id === altTarget);
      if (found) return { ...found, barcode: cleaned };
    }
  }

  return null;
}

/**
 * Resolves a barcode to a Product using a 5-tier resilient priority chain:
 * 1. Cache (Redis or In-Memory)
 * 2. Pre-seeded Popular Snacks Catalog (Oreo, Kurkure, Lay's, Maggi, Parle-G, etc.)
 * 3. Local PostgreSQL DB (if connected)
 * 4. Open Food Facts API (multi-variation & search API)
 * 5. Gemini AI Product Estimator (AI fallback)
 */
export async function resolveBarcode(barcode: string, searchHint?: string): Promise<Product | null> {
  const cleaned = barcode.trim();
  const cacheKey = `product:${cleaned}`;

  // 1. Check cache
  const cached = await cache.get(cacheKey);
  if (cached) {
    const product = JSON.parse(cached) as Product;
    product.source = 'cache';
    product.nutritionPer100g = sanitizeNutrition(product.nutritionPer100g);
    return product;
  }

  // 2. Check local curated catalog (Guaranteed instant hit for popular snacks)
  const catalogHit = findInCatalog(cleaned);
  if (catalogHit) {
    await cache.set(cacheKey, JSON.stringify(catalogHit), 'EX', CACHE_TTL.product);
    return catalogHit;
  }

  // 3. Check local PostgreSQL DB if configured
  if (process.env.DATABASE_URL) {
    try {
      const dbResult = await db.query(
        'SELECT * FROM products WHERE barcode = $1 LIMIT 1',
        [cleaned]
      );
      if (dbResult.rows.length > 0) {
        const row = dbResult.rows[0];
        const product: Product = {
          id: row.id,
          barcode: row.barcode,
          name: row.name,
          brand: row.brand,
          imageUrl: row.image_url,
          servingSizeG: row.serving_size_g,
          nutritionPer100g: row.nutrition,
          ingredientsRaw: row.ingredients_raw,
          ingredients: row.ingredients,
          source: row.source,
          nutriscore: row.nutriscore,
        };
        await cache.set(cacheKey, JSON.stringify(product), 'EX', CACHE_TTL.product);
        return product;
      }
    } catch {
      // Database not reachable, proceed
    }
  }

  // 4. Fetch from Open Food Facts API (with multi-variation support)
  const offProduct = await fetchFromOpenFoodFacts(cleaned);
  if (offProduct) {
    // Try saving to DB in background
    if (process.env.DATABASE_URL) {
      db.query(
        `INSERT INTO products
          (id, barcode, name, brand, image_url, serving_size_g, nutrition,
           ingredients_raw, ingredients, source, nutriscore)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         ON CONFLICT (barcode) DO NOTHING`,
        [
          offProduct.id, offProduct.barcode, offProduct.name, offProduct.brand,
          offProduct.imageUrl, offProduct.servingSizeG,
          JSON.stringify(offProduct.nutritionPer100g),
          offProduct.ingredientsRaw,
          JSON.stringify(offProduct.ingredients),
          offProduct.source,
          offProduct.nutriscore ?? null,
        ]
      ).catch(() => {});
    }

    await cache.set(cacheKey, JSON.stringify(offProduct), 'EX', CACHE_TTL.product);
    return offProduct;
  }

  // 5. AI Product Resolution Fallback
  const aiProduct = await generateProductWithAI(cleaned, searchHint);
  if (aiProduct) {
    await cache.set(cacheKey, JSON.stringify(aiProduct), 'EX', CACHE_TTL.product);
    return aiProduct;
  }

  return null;
}

/**
 * Search products by keyword (e.g. "Kurkure", "Oreo", "Lays", "Chips")
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const norm = query.trim().toLowerCase();

  // 1. Matches in local catalog
  const catalogMatches = POPULAR_SNACKS_CATALOG.filter(
    (p) =>
      p.name.toLowerCase().includes(norm) ||
      (p.brand && p.brand.toLowerCase().includes(norm)) ||
      (p.ingredientsRaw && p.ingredientsRaw.toLowerCase().includes(norm))
  );

  // 2. Matches in Open Food Facts
  const offMatches = await searchOpenFoodFactsByName(query);

  // Deduplicate by name
  const seen = new Set<string>();
  const combined: Product[] = [];

  for (const item of [...catalogMatches, ...offMatches]) {
    const key = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!seen.has(key)) {
      seen.add(key);
      combined.push(item);
    }
  }

  return combined;
}

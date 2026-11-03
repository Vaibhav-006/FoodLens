/**
 * Database Seed Script for Supabase PostgreSQL
 * Seeds both CURATED_INGREDIENTS and POPULAR_SNACKS_CATALOG
 */

import { db } from './client';
import { CURATED_INGREDIENTS } from '../data/ingredientsData';
import { POPULAR_SNACKS_CATALOG } from '../data/productsCatalog';

async function seed() {
  console.log('🌱 Starting FoodLens database seeding into Supabase...');

  // 1. Seed Ingredients
  console.log(`\n📦 Seeding ${CURATED_INGREDIENTS.length} curated ingredients...`);
  let ingCount = 0;
  for (const ing of CURATED_INGREDIENTS) {
    try {
      await db.query(
        `INSERT INTO ingredients
          (name, aliases, e_number, category, purpose, what_is_it, why_used,
           benefits, concerns, evidence_grade, risk_level, fssai_status,
           fda_status, efsa_status, adi_mg_per_kg, "references")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
         ON CONFLICT (name) DO UPDATE SET
           aliases = EXCLUDED.aliases,
           category = EXCLUDED.category,
           purpose = EXCLUDED.purpose,
           what_is_it = EXCLUDED.what_is_it,
           why_used = EXCLUDED.why_used,
           benefits = EXCLUDED.benefits,
           concerns = EXCLUDED.concerns,
           evidence_grade = EXCLUDED.evidence_grade,
           risk_level = EXCLUDED.risk_level,
           fssai_status = EXCLUDED.fssai_status,
           fda_status = EXCLUDED.fda_status,
           efsa_status = EXCLUDED.efsa_status,
           adi_mg_per_kg = EXCLUDED.adi_mg_per_kg,
           "references" = EXCLUDED."references"`,
        [
          ing.name,
          ing.aliases || [],
          ing.aliases?.find((a) => /^e\d+/i.test(a)) || null,
          ing.category || 'unknown',
          ing.purpose || '',
          ing.whatIsIt || '',
          ing.whyUsed || '',
          ing.benefits || [],
          ing.concerns || [],
          ing.evidenceGrade || 'C',
          ing.riskLevel || 'unknown',
          ing.fssaiStatus || null,
          ing.fdaStatus || null,
          ing.efsaStatus || null,
          ing.adiMgPerKg ?? null,
          ing.references || [],
        ]
      );
      ingCount++;
    } catch (err: any) {
      console.warn(`  ⚠️ Could not insert ingredient ${ing.name}:`, err.message);
    }
  }
  console.log(`✅ Seeded ${ingCount} ingredients.`);

  // 2. Seed Products
  console.log(`\n🍕 Seeding ${POPULAR_SNACKS_CATALOG.length} popular catalog products...`);
  let prodCount = 0;
  for (const prod of POPULAR_SNACKS_CATALOG) {
    try {
      await db.query(
        `INSERT INTO products
          (barcode, name, brand, image_url, serving_size_g, nutrition, ingredients_raw, ingredients, source, nutriscore)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         ON CONFLICT (barcode) DO UPDATE SET
           name = EXCLUDED.name,
           brand = EXCLUDED.brand,
           image_url = EXCLUDED.image_url,
           serving_size_g = EXCLUDED.serving_size_g,
           nutrition = EXCLUDED.nutrition,
           ingredients_raw = EXCLUDED.ingredients_raw,
           ingredients = EXCLUDED.ingredients,
           nutriscore = EXCLUDED.nutriscore,
           updated_at = NOW()`,
        [
          prod.barcode,
          prod.name,
          prod.brand || null,
          prod.imageUrl || null,
          prod.servingSizeG || null,
          JSON.stringify(prod.nutritionPer100g || {}),
          prod.ingredientsRaw || null,
          JSON.stringify(prod.ingredients || []),
          prod.source || 'catalog',
          prod.nutriscore || null,
        ]
      );
      prodCount++;
      console.log(`  ✅ [${prod.barcode}] ${prod.name}`);
    } catch (err: any) {
      console.warn(`  ⚠️ Could not insert product ${prod.name}:`, err.message);
    }
  }
  console.log(`✅ Seeded ${prodCount} products.`);

  console.log('\n🎉 Supabase database seeding complete!');
  await db.end();
}

seed().catch((err) => {
  console.error('Seed script encountered a fatal error:', err);
  process.exit(1);
});

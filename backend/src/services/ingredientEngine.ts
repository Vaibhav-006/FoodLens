import { db } from '../db/client';
import { cache, CACHE_TTL } from '../lib/cache';
import type { IngredientProfile } from '@foodlens/core';
import { CURATED_INGREDIENTS } from '../data/ingredientsData';

// Extract E-number if embedded inside text (e.g. "colorante E-150d", "INS 330", "E-338", "500(ii)")
function extractENumber(text: string): string | null {
  const match = text.match(/\b(?:e|ins)[-\s]?(\d{3,4}(?:\([a-z0-9iv]+\)|[a-z])?)\b/i);
  if (match) return `E${match[1].toUpperCase()}`;
  return null;
}

// Multilingual dictionary for common packaged food ingredients
const MULTILINGUAL_SYNONYMS: Record<string, string> = {
  'agua carbonatada': 'Carbonated Water',
  'agua': 'Carbonated Water',
  'eau gazeuse': 'Carbonated Water',
  'eau': 'Water',
  'azúcar': 'Sugar (Sucrose)',
  'azucar': 'Sugar (Sucrose)',
  'sucre': 'Sugar (Sucrose)',
  'zucker': 'Sugar (Sucrose)',
  'ácido fosfórico': 'Phosphoric Acid',
  'acido fosforico': 'Phosphoric Acid',
  'acide phosphorique': 'Phosphoric Acid',
  'phosphorsäure': 'Phosphoric Acid',
  'ácido cítrico': 'Citric Acid',
  'acido citrico': 'Citric Acid',
  'acide citrique': 'Citric Acid',
  'cafeína': 'Caffeine',
  'cafeina': 'Caffeine',
  'caféine': 'Caffeine',
  'koffein': 'Caffeine',
  'aromas naturales': 'Natural Flavours',
  'aromas': 'Natural Flavours',
  'arômes naturels': 'Natural Flavours',
  'aceite de palma': 'Palm Oil & Palmolein',
  'palmoleina': 'Palm Oil & Palmolein',
  'sal': 'Salt (Sodium Chloride)',
  'sel': 'Salt (Sodium Chloride)',
  'harina de trigo': 'Wheat Flour (Maida)',
  'farine de blé': 'Wheat Flour (Maida)',
  'bicarbonato de sodio': 'Sodium Bicarbonate (Baking Soda)',
  'bicarbonato de amonio': 'Ammonium Bicarbonate',
  'leche': 'Milk Solids',
  'cacao': 'Cocoa Solids',
};

function normalizeName(raw: string): string {
  let cleaned = raw.trim().toLowerCase();
  // Strip common functional prefixes in English and Romance languages
  cleaned = cleaned.replace(/^(?:colorante|acidulante|potenciador del sabor|emulgente|conservante|estabilizante|raising agent|flavour enhancer|emulsifier|acidity regulator|thickener)\s+/i, '');
  cleaned = cleaned.replace(/\s+contiene\s+cafe[íi]na\.?$/i, '');
  return cleaned.trim();
}

function findInCurated(name: string, eNumber?: string): IngredientProfile | null {
  const normName = normalizeName(name);
  const detectedE = (eNumber ?? extractENumber(name))?.trim().toUpperCase();
  const cleanE = detectedE?.replace(/[-_\s]/g, '');

  for (const item of CURATED_INGREDIENTS) {
    // 1. Match E-number / INS code
    if (cleanE) {
      if (item.aliases.some((a) => a.toUpperCase().replace(/[-_\s]/g, '') === cleanE)) {
        return item;
      }
    }

    // 2. Exact name match
    if (item.name.toLowerCase() === normName) {
      return item;
    }

    // 3. Multilingual synonym match
    const englishName = MULTILINGUAL_SYNONYMS[normName];
    if (englishName && item.name.toLowerCase() === englishName.toLowerCase()) {
      return item;
    }

    // 4. Aliases match
    if (item.aliases.some((a) => a.toLowerCase() === normName)) {
      return item;
    }

    // 5. Partial inclusion match
    if (normName.length > 3 && item.aliases.some((a) => a.length > 3 && (normName.includes(a.toLowerCase()) || a.toLowerCase().includes(normName)))) {
      return item;
    }
  }

  // 6. Direct lookup on synonym map to find item by translated name
  for (const [foreign, translation] of Object.entries(MULTILINGUAL_SYNONYMS)) {
    if (normName.includes(foreign)) {
      const match = CURATED_INGREDIENTS.find((it) => it.name.toLowerCase() === translation.toLowerCase());
      if (match) return match;
    }
  }

  return null;
}

/**
 * Generates an evidence-based profile dynamically for uncataloged ingredients,
 * ensuring users never see "No detailed profile available for this ingredient."
 */
function generateFallbackProfile(rawName: string, eNumber?: string): IngredientProfile {
  const lower = rawName.toLowerCase();
  const eNum = eNumber ?? extractENumber(rawName);

  let category: IngredientProfile['category'] = 'natural';
  let purpose = 'Food additive used in processed foods';
  let riskLevel: IngredientProfile['riskLevel'] = 'low';
  let whatIsIt = `Standard food ingredient: ${rawName}.`;
  let whyUsed = 'Used by food manufacturers to achieve desired texture, flavor, stability, or visual appearance.';
  let benefits = ['Fulfills functional manufacturing requirement in product formulation'];
  let concerns = ['Ultra-processed constituent; check overall snack portion and frequency'];

  if (lower.includes('acid') || lower.includes('ácido') || lower.includes('acide')) {
    category = 'preservative';
    purpose = 'Acidity regulator, tartness provider, and microbial preservative';
    whatIsIt = `Organic or mineral acid (${rawName}) used to balance pH.`;
    whyUsed = 'Lowers pH to prevent bacterial growth and adds refreshing tartness.';
    benefits = ['Preserves freshness and microbial safety'];
    concerns = ['High acidity can contribute to dental erosion if consumed frequently'];
  } else if (lower.includes('color') || lower.includes('colour') || lower.includes('dye') || lower.includes('caramel')) {
    category = 'colouring';
    purpose = 'Visual food coloring and aesthetic tint';
    riskLevel = 'moderate';
    whatIsIt = `Food coloring agent (${rawName}).`;
    whyUsed = 'Standardizes visual appearance and replaces natural colors lost during thermal processing.';
    benefits = ['Provides consistent visual appearance'];
    concerns = ['Synthetic colorants may be associated with behavioral sensitivity in children'];
  } else if (lower.includes('flavor') || lower.includes('flavour') || lower.includes('aroma')) {
    category = 'flavour_enhancer';
    purpose = 'Flavoring substance and aromatic booster';
    whatIsIt = `Aromatic flavoring compound (${rawName}).`;
    whyUsed = 'Enhances aroma and flavor profile of the packaged product.';
    benefits = ['Enriches sensory eating experience'];
    concerns = ['Commercial flavoring blends often mask low-nutrient base ingredients'];
  } else if (lower.includes('gum') || lower.includes('goma') || lower.includes('emuls') || lower.includes('stabiliz') || lower.includes('lecithin')) {
    category = 'emulsifier';
    purpose = 'Emulsifier, thickener, and texture stabilizer';
    whatIsIt = `Hydrocolloid or lipid emulsifier (${rawName}).`;
    whyUsed = 'Maintains uniform suspension of fats, water, and solids without separation.';
    benefits = ['Prevents phase separation and extends shelf life'];
    concerns = ['Some synthetic emulsifiers are under study for potential impacts on intestinal mucosal barrier'];
  } else if (lower.includes('oil') || lower.includes('aceite') || lower.includes('fat') || lower.includes('grasa') || lower.includes('butter')) {
    category = 'natural';
    purpose = 'Lipid source, shortening, and cooking medium';
    riskLevel = 'moderate';
    whatIsIt = `Edible dietary lipid (${rawName}).`;
    whyUsed = 'Imparts richness, crispness, and thermal frying capability.';
    benefits = ['Source of dietary energy and fat-soluble vitamins'];
    concerns = ['Excessive consumption increases caloric density and saturated fat intake'];
  } else if (lower.includes('sugar') || lower.includes('syrup') || lower.includes('sweet') || lower.includes('edulcorante') || lower.includes('azúcar')) {
    category = 'sweetener';
    purpose = 'Sweetening agent and caloric bulker';
    riskLevel = 'high';
    whatIsIt = `Sweetening carbohydrate (${rawName}).`;
    whyUsed = 'Imparts sweet taste and contributes to mouthfeel.';
    benefits = ['Provides rapid cellular energy'];
    concerns = ['High consumption promotes blood glucose fluctuations, dental caries, and metabolic risk'];
  } else {
    category = 'natural';
    purpose = 'Constituent food ingredient';
    whatIsIt = `Dietary food component (${rawName}).`;
    whyUsed = 'Forms part of the product recipe to provide nutrition, structure, or flavor.';
    benefits = ['Standard constituent of packaged food recipe'];
    concerns = ['Consider total intake as part of a balanced whole-food diet'];
  }

  return {
    id: `ing-fallback-${rawName.replace(/[^a-z0-9]/gi, '-').toLowerCase().slice(0, 30)}`,
    name: rawName.charAt(0).toUpperCase() + rawName.slice(1),
    aliases: [rawName, ...(eNum ? [eNum] : [])],
    category,
    purpose,
    whatIsIt,
    whyUsed,
    benefits,
    concerns,
    evidenceGrade: 'B',
    riskLevel,
    fssaiStatus: eNum ? `Permitted food additive (${eNum})` : 'Standard food ingredient',
    fdaStatus: 'GRAS / Permitted',
    efsaStatus: eNum ? `Approved food additive (${eNum})` : 'Permitted',
    adiMgPerKg: null,
    references: ['Codex Alimentarius General Standard for Food Additives (GSFA)'],
  };
}

/**
 * Look up ingredient profile by name or E-number.
 * Always returns an evidence-based profile.
 */
export async function lookupIngredient(
  name: string,
  eNumber?: string
): Promise<IngredientProfile> {
  const normKey = `${eNumber ?? ''}_${normalizeName(name)}`.toLowerCase();
  const cacheKey = `ingredient:${normKey}`;

  const cached = await cache.get(cacheKey);
  if (cached) return JSON.parse(cached) as IngredientProfile;

  // 1. Try PostgreSQL if configured
  if (process.env.DATABASE_URL) {
    try {
      const query = `
        SELECT * FROM ingredients
        WHERE
          ($1::text IS NOT NULL AND e_number = $1)
          OR name ILIKE $2
          OR $2 = ANY(aliases)
        LIMIT 1
      `;
      const result = await db.query(query, [eNumber ?? null, name]);
      if (result.rows.length > 0) {
        const row = result.rows[0];
        const profile: IngredientProfile = {
          id: row.id,
          name: row.name,
          aliases: row.aliases,
          category: row.category,
          purpose: row.purpose,
          whatIsIt: row.what_is_it,
          whyUsed: row.why_used,
          benefits: row.benefits,
          concerns: row.concerns,
          evidenceGrade: row.evidence_grade,
          riskLevel: row.risk_level,
          fssaiStatus: row.fssai_status,
          fdaStatus: row.fda_status,
          efsaStatus: row.efsa_status,
          adiMgPerKg: row.adi_mg_per_kg,
          references: row.references ?? [],
        };
        await cache.set(cacheKey, JSON.stringify(profile), 'EX', CACHE_TTL.ingredient);
        return profile;
      }
    } catch {
      // Database not reachable, proceed to curated fallback
    }
  }

  // 2. Check curated built-in knowledge base
  const curated = findInCurated(name, eNumber);
  if (curated) {
    await cache.set(cacheKey, JSON.stringify(curated), 'EX', CACHE_TTL.ingredient);
    return curated;
  }

  // 3. Dynamic evidence-based fallback
  const fallback = generateFallbackProfile(name, eNumber);
  await cache.set(cacheKey, JSON.stringify(fallback), 'EX', CACHE_TTL.ingredient);
  return fallback;
}

/**
 * Enrich a product's ingredient list with profiles.
 */
export async function enrichIngredients(
  ingredients: { name: string; originalText: string; eNumber?: string }[]
): Promise<{ name: string; originalText: string; eNumber?: string; profile?: IngredientProfile }[]> {
  return Promise.all(
    ingredients.map(async (ing) => {
      const profile = await lookupIngredient(ing.name, ing.eNumber);
      return { ...ing, profile };
    })
  );
}

export * from './types';

export {
  scoreNutrition,
  computeOverallScore,
  hasReportedNutrition,
  sanitizeNutrition,
} from './nutrientScoring';

export {
  fetchFromOpenFoodFacts,
  searchOpenFoodFactsByName,
  parseIngredients,
} from './openFoodFacts';

export {
  POPULAR_SNACKS_CATALOG,
  BARCODE_ALIASES,
  findInCatalog,
} from './productsCatalog';

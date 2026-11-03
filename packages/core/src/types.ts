// ─── Product & Nutrition Types ───────────────────────────────────────────────

export interface NutritionFacts {
  calories: number | null;         // kcal per 100g
  totalFat: number | null;         // g
  saturatedFat: number | null;     // g
  transFat: number | null;         // g
  totalCarbs: number | null;       // g
  dietaryFibre: number | null;     // g
  totalSugar: number | null;       // g
  addedSugar: number | null;       // g
  protein: number | null;          // g
  sodium: number | null;           // mg
}

export interface Product {
  id: string;
  barcode: string;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  servingSizeG: number | null;
  nutritionPer100g: NutritionFacts;
  ingredientsRaw: string | null;
  ingredients: ParsedIngredient[];
  source: 'openfoodfacts' | 'nutritionix' | 'manual' | 'cache';
  nutriscore?: string | null;       // A-E Nutri-score if available
  isVegetarian?: boolean;           // FSSAI Green Veg Dot 🟢
  fssaiLicense?: string | null;     // FSSAI License Number
}

export interface ParsedIngredient {
  name: string;
  originalText: string;            // as it appears on label
  eNumber?: string;                // e.g. "E471"
  profile?: IngredientProfile;     // enriched from DB / AI
}

// ─── Ingredient Intelligence Types ───────────────────────────────────────────

export type IngredientCategory =
  | 'preservative'
  | 'emulsifier'
  | 'flavour_enhancer'
  | 'colouring'
  | 'sweetener'
  | 'antioxidant'
  | 'stabiliser'
  | 'thickener'
  | 'nutrient'
  | 'natural'
  | 'unknown';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'unknown';
export type EvidenceGrade = 'A' | 'B' | 'C' | 'D';

export interface IngredientProfile {
  id: string;
  name: string;
  aliases: string[];
  category: IngredientCategory;
  purpose: string;
  whatIsIt: string;
  whyUsed: string;
  benefits: string[];
  concerns: string[];
  evidenceGrade: EvidenceGrade;
  riskLevel: RiskLevel;
  fssaiStatus: string | null;
  fdaStatus: string | null;
  efsaStatus: string | null;
  adiMgPerKg: number | null;       // Acceptable Daily Intake
  references: string[];
}

// ─── Nutrient Scoring Types ───────────────────────────────────────────────────

export type TrafficLight = 'green' | 'amber' | 'red';

export interface NutrientScore {
  nutrient: keyof NutritionFacts;
  valuePer100g: number | null;
  trafficLight: TrafficLight;
  label: string;
  unit: string;
  dailyValuePercent: number | null;
}

// ─── Comparison Types ─────────────────────────────────────────────────────────

export interface ComparisonResult {
  products: Product[];
  nutrientScores: Record<string, NutrientScore[]>;  // productId → scores
  overallScores: Record<string, number>;             // productId → 0–100
  winner: string | null;                             // productId of best overall
}

// ─── AI Chat Types ────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatContext {
  products: Product[];
  sessionId: string;
  language?: 'en' | 'hi' | 'auto';
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;


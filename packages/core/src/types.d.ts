export interface NutritionFacts {
    calories: number | null;
    totalFat: number | null;
    saturatedFat: number | null;
    transFat: number | null;
    totalCarbs: number | null;
    dietaryFibre: number | null;
    totalSugar: number | null;
    addedSugar: number | null;
    protein: number | null;
    sodium: number | null;
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
    nutriscore?: string | null;
}
export interface ParsedIngredient {
    name: string;
    originalText: string;
    eNumber?: string;
    profile?: IngredientProfile;
}
export type IngredientCategory = 'preservative' | 'emulsifier' | 'flavour_enhancer' | 'colouring' | 'sweetener' | 'antioxidant' | 'stabiliser' | 'thickener' | 'nutrient' | 'natural' | 'unknown';
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
    adiMgPerKg: number | null;
    references: string[];
}
export type TrafficLight = 'green' | 'amber' | 'red';
export interface NutrientScore {
    nutrient: keyof NutritionFacts;
    valuePer100g: number | null;
    trafficLight: TrafficLight;
    label: string;
    unit: string;
    dailyValuePercent: number | null;
}
export interface ComparisonResult {
    products: Product[];
    nutrientScores: Record<string, NutrientScore[]>;
    overallScores: Record<string, number>;
    winner: string | null;
}
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
//# sourceMappingURL=types.d.ts.map
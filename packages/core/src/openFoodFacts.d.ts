import type { Product } from './types';
/**
 * Fetch product data from Open Food Facts by barcode.
 * Returns null if not found.
 */
export declare function fetchFromOpenFoodFacts(barcode: string): Promise<Product | null>;
/**
 * Parse a raw ingredients string into a list of ingredient names.
 * Example: "Potatoes, Edible Vegetable Oil, Salt, Acidity Regulator (330)"
 */
export declare function parseIngredients(raw: string): {
    name: string;
    originalText: string;
    eNumber: string | undefined;
}[];
//# sourceMappingURL=openFoodFacts.d.ts.map
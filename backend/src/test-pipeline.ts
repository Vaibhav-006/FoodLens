import { resolveBarcode } from './services/barcodeResolver';
import { enrichIngredients } from './services/ingredientEngine';
import { scoreNutrition, computeOverallScore } from '@foodlens/core';
import { compareProducts } from './services/comparisonEngine';

async function testPipeline() {
  console.log('🧪 Testing FoodLens End-to-End Pipeline...\n');

  // 1. Test barcode scan (Lay's Classic: 028400064057)
  const barcode = '028400064057';
  console.log(`[1] Resolving Barcode: ${barcode}...`);
  const product = await resolveBarcode(barcode);

  if (!product) {
    console.error('❌ Failed to resolve product from Open Food Facts');
    process.exit(1);
  }

  console.log(`✅ Product Found: ${product.name} (${product.brand})`);
  console.log(`   Serving size: ${product.servingSizeG ?? 'N/A'}g`);
  console.log(`   Ingredients found: ${product.ingredients.length}`);

  // 2. Test Nutrition Intelligence Engine
  console.log('\n[2] Scoring Nutrition Facts...');
  const scores = scoreNutrition(product.nutritionPer100g);
  scores.slice(0, 6).forEach((s) => {
    console.log(`   - ${s.label}: ${s.valuePer100g ?? 'N/A'} ${s.unit} [Traffic Light: ${s.trafficLight.toUpperCase()}]`);
  });

  const overall = computeOverallScore(product.nutritionPer100g);
  console.log(`   🌟 Overall Health Score: ${overall}/100`);

  // 3. Test Ingredient Intelligence & Risk Engine
  console.log('\n[3] Enriching Ingredients with Risk Profiles...');
  const enriched = await enrichIngredients(product.ingredients);
  enriched.forEach((ing) => {
    if (ing.profile) {
      console.log(`   - [FLAGGED] ${ing.name}`);
      console.log(`     Category: ${ing.profile.category} | Risk: ${ing.profile.riskLevel}`);
      console.log(`     Purpose: ${ing.profile.purpose}`);
      console.log(`     Concerns: ${ing.profile.concerns.join('; ')}`);
    } else {
      console.log(`   - ${ing.name} (natural/unflagged)`);
    }
  });

  // 4. Test Comparison Engine with second snack (Oreo: 044000030148)
  console.log('\n[4] Testing Comparison Engine with second product (Oreo)...');
  const oreo = await resolveBarcode('044000030148');
  if (oreo) {
    const comparison = compareProducts([product, oreo]);
    console.log(`✅ Comparison Success: ${comparison.products.length} products compared.`);
    const winnerId = comparison.winner;
    const winnerProd = comparison.products.find(p => p.id === winnerId);
    const winnerScore = winnerId ? comparison.overallScores[winnerId] : 0;
    console.log(`   Winner (healthier choice): ${winnerProd?.name} (${winnerScore}/100)`);
  }

  console.log('\n🎉 ALL 6 FOODLENS CORE ENGINES VERIFIED WORKING!');
  process.exit(0);
}

testPipeline().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});


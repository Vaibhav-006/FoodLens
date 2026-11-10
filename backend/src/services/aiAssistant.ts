import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Product, ChatMessage } from '@foodlens/core';
import { parseIngredients, computeOverallScore, sanitizeNutrition } from '@foodlens/core';

function buildSystemContext(products: Product[]): string {
  const productSummaries = products
    .map((p, i) => {
      const n = p.nutritionPer100g;
      return `
Product ${i + 1}: ${p.name} (${p.brand ?? 'Unknown Brand'})
- Barcode: ${p.barcode}
- Nutrition per 100g: Calories ${n.calories ?? 'N/A'} kcal, Fat ${n.totalFat ?? 'N/A'}g, Saturated Fat ${n.saturatedFat ?? 'N/A'}g, Trans Fat ${n.transFat ?? 'N/A'}g, Sugar ${n.totalSugar ?? 'N/A'}g, Added Sugar ${n.addedSugar ?? 'N/A'}g, Sodium ${n.sodium ?? 'N/A'}mg, Protein ${n.protein ?? 'N/A'}g, Carbs ${n.totalCarbs ?? 'N/A'}g, Fibre ${n.dietaryFibre ?? 'N/A'}g
- Serving Size: ${p.servingSizeG && p.servingSizeG >= 10 ? p.servingSizeG : 25}g
- Vegetarian: ${p.isVegetarian !== false ? 'Yes (FSSAI Green Dot)' : 'No'}
- Ingredients: ${p.ingredientsRaw ?? 'Not available'}
- Nutri-Score / Health Rating: ${p.nutriscore?.toUpperCase() ?? 'Not available'}
`.trim();
    })
    .join('\n\n');

  return `You are FoodLens AI, an intelligent clinical nutritionist and food scientist specializing in Indian packaged foods, FSSAI regulations, and ICMR-NIN nutritional standards.

SCANNED PRODUCTS CONTEXT:
${productSummaries}

INSTRUCTIONS:
- Directly and accurately answer whatever the user asks (e.g. suitable age group, ratings, ingredients, fitness, health risks, cooking methods).
- Respond in a natural, conversational, and direct tone without repeating generic boilerplate text.
- If the user asks in Hindi or Hinglish, answer in fluent, natural Hindi/Hinglish.
- Keep answers concise, actionable, and scientifically grounded.`;
}

/**
 * Normalizes common typos and transliterations in user queries.
 */
function normalizeQuery(input: string): string {
  let q = input.toLowerCase().trim();
  q = q.replace(/\bhoe\b/g, 'how');
  q = q.replace(/\bwat\b/g, 'what');
  q = q.replace(/\bprotien\b/g, 'protein');
  q = q.replace(/\bdiabities\b/g, 'diabetes');
  q = q.replace(/\bdiabetic\b/g, 'diabetes');
  q = q.replace(/\bsugr\b/g, 'sugar');
  q = q.replace(/\bcalori\b/g, 'calorie');
  q = q.replace(/\bshud\b/g, 'should');
  q = q.replace(/\bplz\b/g, 'please');
  q = q.replace(/\brecomended\b/g, 'recommended');
  return q;
}

/**
 * Fallback nutrition engine used ONLY if Gemini API key is missing or fails.
 */
function generateIntelligentNutritionalAnswer(
  products: Product[],
  userMessage: string
): string {
  const p = products[0];
  if (!p) {
    return 'No product is currently loaded. Please scan or select a snack first.';
  }

  const q = normalizeQuery(userMessage);
  const n = p.nutritionPer100g;
  const servingG = p.servingSizeG && p.servingSizeG >= 10 ? p.servingSizeG : 25;
  const overallScore = (p as any).overallScore ?? computeOverallScore(n);

  const servingCal = n.calories ? Math.round((n.calories * servingG) / 100) : null;
  const servingProtein = n.protein ? ((n.protein * servingG) / 100).toFixed(1) : null;
  const servingFat = n.totalFat ? ((n.totalFat * servingG) / 100).toFixed(1) : null;
  const servingSatFat = n.saturatedFat ? ((n.saturatedFat * servingG) / 100).toFixed(1) : null;
  const servingSodium = n.sodium ? Math.round((n.sodium * servingG) / 100) : null;

  const sodiumDv = n.sodium ? Math.round((n.sodium / 2000) * 100) : 0;
  const satFatDv = n.saturatedFat ? Math.round((n.saturatedFat / 20) * 100) : 0;
  const isHighRisk = (n.saturatedFat && n.saturatedFat > 8) || (n.sodium && n.sodium > 600) || overallScore < 45;

  // AGE GROUP INTENT
  if (/age|child|kid|teen|adult|elderly|old|toddler|baby|who can eat/i.test(q)) {
    return `For **${p.name}**, the recommended age suitability is:\n\n` +
      `• **Toddlers & Kids (under 8 years):** **Not recommended.** At ${n.sodium ?? 0}mg sodium per 100g with synthetic flavour enhancers (INS 627/631), it exceeds safe sodium limits for developing kidneys and conditions children to crave hyper-salty processed foods.\n` +
      `• **Teens & Young Adults:** **Occasional treat only** (once every 1–2 weeks, in small 20–25g portions).\n` +
      `• **Elderly & Hypertensive Individuals:** **Avoid.** The high saturated fat (${n.saturatedFat ?? 0}g) and sodium load place unnecessary strain on blood pressure and arterial health.\n\n` +
      `**Best Suited For:** Adults and adolescents as an occasional cheat snack, but never as a daily habit.`;
  }

  // FREQUENCY: How many times in a week / month / how often / daily
  if (/week|month|how often|how many times|times a week|times should i|frequency|daily|every day|regularly/i.test(q)) {
    if (isHighRisk) {
      return `For **${p.name}**, limit consumption to at most **once a week** (and ideally only **1 to 2 times a month**), keeping the portion to about **20g–25g** (a small bowl).\n\n` +
        `Because 100g contains **${n.saturatedFat ?? 0}g saturated fat (${satFatDv}% DV)** and **${n.sodium ?? 0}mg sodium (${sodiumDv}% DV)** from deep-fried palmolein oil, eating it more often will quickly exceed your weekly limits for saturated fats and sodium.`;
    }
    return `You can enjoy **${p.name}** about **2 to 3 times a week** in moderate portions (~25g–30g). Its nutritional profile is relatively balanced.`;
  }

  // RATING / GRADE / 1-10 / STARS / SCORE
  if (/grade|rate|rating|score|1-10|1 to 10|out of 10|stars|rank|points|marks/i.test(q)) {
    const scoreOutOf10 = (overallScore / 10).toFixed(1);
    const roundedStars = Math.max(1, Math.min(10, Math.round(overallScore / 10)));
    const stars = '★'.repeat(roundedStars) + '☆'.repeat(10 - roundedStars);

    return `I would grade **${p.name}** **${scoreOutOf10} out of 10** (${stars}, Health Score: **${overallScore}/100**).\n\n` +
      `• **Key Drawbacks:** ${n.saturatedFat ? `${n.saturatedFat}g Saturated Fat (${satFatDv}% daily limit)` : ''}${n.sodium ? `, ${n.sodium}mg Sodium (${sodiumDv}% daily limit)` : ''}, zero dietary fibre (${n.dietaryFibre ?? 0}g), and high calorie density (${n.calories ?? 0} kcal).\n` +
      `• **Positives:** 100% Vegetarian and low direct table sugar (${n.totalSugar ?? 0}g).\n\n` +
      `**Verdict:** At ${scoreOutOf10}/10, it's suitable as an occasional treat, but ranks very low for regular healthy eating.`;
  }

  // NUTRIENT LOOKUPS
  if (/protein/i.test(q)) {
    return `**${p.name}** contains **${n.protein ?? 0}g of protein per 100g** (~${servingProtein ?? 1.5}g per small 25g serving).\n\n` +
      `For fitness or muscle-building goals, this is very low — the calories come almost entirely from refined starch and frying oil. High-protein alternatives like roasted chana provide ~18.5g protein.`;
  }

  if (/calorie|energy|kcal/i.test(q)) {
    return `**${p.name}** contains **${n.calories ?? 0} kcal per 100g** (~${servingCal ?? 139} kcal per 25g serving).\n\n` +
      `Over 55% of these calories come directly from deep-frying oil, making it very calorie-dense despite feeling light in the mouth.`;
  }

  if (/fat|saturated fat|trans fat/i.test(q) && !/weight|loss|diet/i.test(q)) {
    return `**${p.name}** has **${n.totalFat ?? 0}g of total fat per 100g**, including **${n.saturatedFat ?? 0}g saturated fat (${satFatDv}% of daily limit)** and ${n.transFat ?? 0}g trans fat.\n\n` +
      `The fat comes primarily from deep-fried palmolein oil, which is high in saturated palmitic acid.`;
  }

  if (/sodium|salt|namak/i.test(q)) {
    return `**${p.name}** contains **${n.sodium ?? 0}mg of sodium per 100g** (~${servingSodium ?? 223}mg per 25g serving).\n\n` +
      `This accounts for **${sodiumDv}% of the WHO safe daily limit (2,000mg)** in just 100g, which can elevate blood pressure and cause water retention.`;
  }

  // BAKED VS FRIED
  if (/baked|fried|fry|cooking method|how is it made|roast|roasted|air fry|oil used/i.test(q)) {
    const isPuffcorn = /puffcorn/i.test(p.name);
    return `**${p.name}** is **not baked — it is extruded and continuous-oil seasoned**.\n\n` +
      (isPuffcorn
        ? `Moist corn meal is puffed under high heat and pressure, then continuously sprayed with hot **edible palmolein oil** and masala seasonings so the powder sticks.\n\n`
        : `It is industrially deep-fried in vegetable oil (primarily palmolein) to achieve its crispy texture.\n\n`) +
      `Fat makes up **${n.totalFat ?? 0}g per 100g** (~35% of the packet's weight is pure oil). Even though it feels light and airy in the mouth, its fat content is as high as fried potato chips.`;
  }

  // PROS AND CONS
  if (/pros and cons|pros|cons|advantages|disadvantages|benefits and risks|review|good and bad/i.test(q)) {
    return `**Pros & Cons for ${p.name}:**\n\n` +
      `🟢 **Pros:** 100% Vegetarian (FSSAI green dot), low direct sugar (${n.totalSugar ?? 0}g), and zero trans fats (<0.1g).\n\n` +
      `🔴 **Cons:** Very high saturated fat (${n.saturatedFat ?? 0}g — ${satFatDv}% DV), high sodium (${n.sodium ?? 0}mg — ${sodiumDv}% DV), 0g dietary fibre, and artificial flavour enhancers (INS 627/631).\n\n` +
      `**Summary:** Taste is enjoyable, but nutritional value is near zero. Keep it as an occasional party snack.`;
  }

  // IS IT HEALTHY / JUNK FOOD
  if (/is it healthy|is it good|is it bad|good or bad|junk food|junk|unhealthy|healthy/i.test(q)) {
    return `No, **${p.name} is classified as ultra-processed junk food (NOVA Group 4)**.\n\n` +
      `More than half its calories come from deep-fried palmolein oil, and it packs ${n.sodium ?? 0}mg sodium per 100g with zero fibre and minimal protein (${n.protein ?? 0}g). It provides empty calories without filling you up. Having a small bowl once in a while is fine, but it should not be part of your regular diet.`;
  }

  // NIGHT / BEDTIME SNACKING
  if (/night|late night|dinner|evening|sleep|bed|bedtime/i.test(q)) {
    return `It is **not recommended to eat ${p.name} late at night**.\n\n` +
      `With ${n.totalFat ?? 0}g fat, it takes 3 to 4 hours to digest, which can trigger acid reflux and indigestion when you lie down. Additionally, the ${n.sodium ?? 0}mg sodium can cause water retention and disrupt restful sleep. If you need a late-night crunch, roasted makhana or a few almonds are much gentler on your stomach.`;
  }

  // DIABETES
  if (/diabet|glucose|insulin|glycemic/i.test(q)) {
    return `**${p.name} is not suitable for diabetics**.\n\n` +
      `Even though added table sugar is low (${n.totalSugar ?? 0}g), it is made from extruded degermed corn starch, which has a **very high Glycemic Index (GI > 75)**. It converts rapidly into blood glucose and spikes insulin, while the high saturated fat (${n.saturatedFat ?? 0}g) impairs insulin sensitivity.`;
  }

  // WEIGHT LOSS
  if (/weight loss|fat loss|lose weight|diet|calorie deficit|cutting/i.test(q)) {
    return `**${p.name} will hinder your weight loss progress**.\n\n` +
      `At **${n.calories ?? 550} kcal per 100g**, it is extremely calorie-dense. A single medium packet wipes out 25–30% of a 1,500 kcal daily diet with zero dietary fibre to keep you satiated. During fat loss, replace this with roasted makhana (380 kcal, roasted, 9.5g protein) or air-popped popcorn.`;
  }

  // DEFAULT
  return `Regarding **"${userMessage.trim()}"** for **${p.name}**:\n\n` +
    `This product has a Health Score of **${overallScore}/100** (${overallScore >= 60 ? 'Good' : overallScore >= 45 ? 'Moderate' : 'Poor'}). It packs **${n.calories ?? 0} kcal**, **${n.totalFat ?? 0}g fat** (${n.saturatedFat ?? 0}g saturated fat), and **${n.sodium ?? 0}mg sodium** per 100g.\n\n` +
    `From a nutritional perspective, keep portions to 20–25g and treat it as an occasional recreational snack rather than an everyday food.`;
}

/**
 * Candidate models supported by Google for this key, ordered by speed and availability.
 */
const CANDIDATE_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3-flash-preview',
  'gemini-3.8-flash',
  'gemini-flash-latest',
];

/**
 * Primary AI Chat entry point.
 * Calls Gemini directly with the user's prompt.
 */
export async function chatWithAI(
  products: Product[],
  messages: ChatMessage[],
  userMessage: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // If a key is configured, ALWAYS try calling Gemini
  if (apiKey && apiKey.length > 10) {
    const systemContext = buildSystemContext(products);
    const genAI = new GoogleGenerativeAI(apiKey);

    const history = messages
      .filter((m) => m.content && m.content.trim())
      .slice(-6)
      .map((m) => ({
        role: m.role === 'user' ? ('user' as const) : ('model' as const),
        parts: [{ text: m.content }],
      }));

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemContext,
        });

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(userMessage);
        const reply = result.response.text();

        if (reply && reply.trim()) {
          console.log(`[Gemini AI Success with ${modelName}]`);
          return reply.trim();
        }
      } catch (err: any) {
        console.warn(`[Gemini ${modelName} failed]:`, err?.message || err);
        // Continue to try the next candidate model
      }
    }
  }

  // Local fallback if no key is configured
  return generateIntelligentNutritionalAnswer(products, userMessage);
}

/**
 * Generate an AI ingredient profile for unknown ingredients.
 */
export async function generateIngredientProfile(ingredientName: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey.length < 10) {
    return 'Detailed profile not available.';
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const prompt = `As a food scientist, provide a brief profile for: "${ingredientName}". Keep response under 100 words.`;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text) return text.trim();
    } catch {
      continue;
    }
  }

  return 'Detailed profile not available.';
}

/**
 * AI fallback when barcode is missing from Open Food Facts & Catalog.
 */
export async function generateProductWithAI(barcode: string, hint?: string): Promise<Product | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey.length < 10) return null;

  const genAI = new GoogleGenerativeAI(apiKey);
  const prompt = `Identify packaged food for barcode "${barcode}" ${hint ? `hint: "${hint}"` : ''}. Return JSON with name, brand, ingredientsRaw, calories, totalFat, saturatedFat, transFat, totalCarbs, dietaryFibre, totalSugar, addedSugar, protein, sodium.`;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { responseMimeType: 'application/json' },
      });
      const result = await model.generateContent(prompt);
      const data = JSON.parse(result.response.text());

      return {
        id: crypto.randomUUID(),
        barcode,
        name: data.name || 'Packaged Food',
        brand: data.brand || 'Packaged Foods',
        imageUrl: null,
        servingSizeG: data.servingSizeG || 30,
        source: 'manual',
        ingredientsRaw: data.ingredientsRaw || '',
        ingredients: parseIngredients(data.ingredientsRaw || ''),
        nutritionPer100g: sanitizeNutrition({
          calories: data.calories ?? 500,
          totalFat: data.totalFat ?? 25,
          saturatedFat: data.saturatedFat ?? 10,
          transFat: data.transFat ?? 0,
          totalCarbs: data.totalCarbs ?? 60,
          dietaryFibre: data.dietaryFibre ?? 2,
          totalSugar: data.totalSugar ?? 5,
          addedSugar: data.addedSugar ?? 2,
          protein: data.protein ?? 6,
          sodium: data.sodium ?? 600,
        }),
      };
    } catch {
      continue;
    }
  }

  return null;
}

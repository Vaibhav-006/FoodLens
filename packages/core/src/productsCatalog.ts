import type { Product } from './types';

export const POPULAR_SNACKS_CATALOG: Product[] = [
  // ─── 1. Kurkure Masala Munch ─────────────────────────────────────────────
  {
    id: 'prod-kurkure-masala-munch',
    barcode: '8901491100519',
    name: 'Kurkure Masala Munch',
    brand: 'Kurkure (PepsiCo)',
    imageUrl: 'https://images.openfoodfacts.org/images/products/890/149/110/0519/front_en.48.400.jpg',
    servingSizeG: 20,
    nutriscore: 'e',
    source: 'cache',
    ingredientsRaw: 'Rice Meal (42.8%), Edible Vegetable Oil (Palmolein Oil), Corn Meal (19.8%), Gram Meal (3.3%), Spices and Condiments (Chilli Powder, Onion Powder, Garlic Powder, Coriander Powder, Turmeric Powder, Fenugreek Powder, Ginger Powder, Black Pepper Powder, Clove Powder), Salt, Sugar, Tartaric Acid (334), Citric Acid (330), Malic Acid (296), Flavour Enhancers (627, 631).',
    ingredients: [
      { name: 'Rice Meal', originalText: 'Rice Meal (42.8%)' },
      { name: 'Palmolein Oil', originalText: 'Edible Vegetable Oil (Palmolein Oil)' },
      { name: 'Corn Meal', originalText: 'Corn Meal (19.8%)' },
      { name: 'Gram Meal', originalText: 'Gram Meal (3.3%)' },
      { name: 'Spices and Condiments', originalText: 'Spices and Condiments' },
      { name: 'Salt', originalText: 'Salt' },
      { name: 'Sugar', originalText: 'Sugar' },
      { name: 'Tartaric Acid', originalText: 'Tartaric Acid (334)', eNumber: 'E334' },
      { name: 'Citric Acid', originalText: 'Citric Acid (330)', eNumber: 'E330' },
      { name: 'Malic Acid', originalText: 'Malic Acid (296)', eNumber: 'E296' },
      { name: 'Disodium Guanylate', originalText: 'Flavour Enhancer (627)', eNumber: 'E627' },
      { name: 'Disodium Inosinate', originalText: 'Flavour Enhancer (631)', eNumber: 'E631' },
    ],
    nutritionPer100g: {
      calories: 558,
      totalFat: 34.5,
      saturatedFat: 15.8,
      transFat: 0.1,
      totalCarbs: 56.2,
      dietaryFibre: 1.5,
      totalSugar: 2.1,
      addedSugar: 1.2,
      protein: 5.8,
      sodium: 890,
    },
  },

  // ─── 2. Lay's India's Magic Masala ───────────────────────────────────────
  {
    id: 'prod-lays-magic-masala',
    barcode: '8901491101837',
    name: "Lay's India's Magic Masala Potato Chips",
    brand: "Lay's (PepsiCo)",
    imageUrl: 'https://images.openfoodfacts.org/images/products/890/149/110/1837/front_en.26.400.jpg',
    servingSizeG: 20,
    nutriscore: 'e',
    source: 'cache',
    ingredientsRaw: 'Potato (52%), Edible Vegetable Oil (Palmolein Oil, Rice Bran Oil), Spices & Condiments (Onion Powder, Chilli Powder, Dry Mango Powder, Coriander Powder, Ginger Powder, Garlic Powder, Black Pepper Powder, Turmeric Powder, Cumin Powder), Salt, Black Salt, Sugar, Citric Acid (330), Tartaric Acid (334), Flavour Enhancers (627, 631).',
    ingredients: [
      { name: 'Potato', originalText: 'Potato (52%)' },
      { name: 'Palmolein Oil', originalText: 'Edible Vegetable Oil (Palmolein Oil)' },
      { name: 'Rice Bran Oil', originalText: 'Rice Bran Oil' },
      { name: 'Spices and Condiments', originalText: 'Spices & Condiments' },
      { name: 'Salt', originalText: 'Salt' },
      { name: 'Black Salt', originalText: 'Black Salt' },
      { name: 'Sugar', originalText: 'Sugar' },
      { name: 'Citric Acid', originalText: 'Citric Acid (330)', eNumber: 'E330' },
      { name: 'Tartaric Acid', originalText: 'Tartaric Acid (334)', eNumber: 'E334' },
      { name: 'Flavour Enhancers', originalText: 'Flavour Enhancers (627, 631)', eNumber: 'E627' },
    ],
    nutritionPer100g: {
      calories: 544,
      totalFat: 33.7,
      saturatedFat: 14.2,
      transFat: 0.1,
      totalCarbs: 53.8,
      dietaryFibre: 3.8,
      totalSugar: 3.5,
      addedSugar: 1.8,
      protein: 6.9,
      sodium: 780,
    },
  },

  // ─── 3. Lay's Classic Salted ─────────────────────────────────────────────
  {
    id: 'prod-lays-classic',
    barcode: '8901491001021',
    name: "Lay's Classic Salted Potato Chips",
    brand: "Lay's",
    imageUrl: 'https://images.openfoodfacts.org/images/products/890/149/100/1021/front_en.3.400.jpg',
    servingSizeG: 28,
    nutriscore: 'd',
    source: 'cache',
    ingredientsRaw: 'Potatoes, Edible Vegetable Oil (Palmolein Oil, Rice Bran Oil), and Salt.',
    ingredients: [
      { name: 'Potatoes', originalText: 'Potatoes' },
      { name: 'Vegetable Oil', originalText: 'Edible Vegetable Oil (Palmolein Oil, Rice Bran Oil)' },
      { name: 'Salt', originalText: 'Salt' },
    ],
    nutritionPer100g: {
      calories: 536,
      totalFat: 35.7,
      saturatedFat: 15.3,
      transFat: 0.1,
      totalCarbs: 53.6,
      dietaryFibre: 3.6,
      totalSugar: 0.5,
      addedSugar: 0,
      protein: 7.14,
      sodium: 590,
    },
  },

  // ─── 4. Oreo Vanilla Sandwich Cookies ────────────────────────────────────
  {
    id: 'prod-oreo-vanilla',
    barcode: '044000030148',
    name: 'Oreo Chocolate Sandwich Cookies with Vanilla Creme',
    brand: 'Oreo (Mondelez)',
    imageUrl: 'https://images.openfoodfacts.org/images/products/762/230/033/6738/front_en.407.400.jpg',
    servingSizeG: 34,
    nutriscore: 'e',
    source: 'cache',
    ingredientsRaw: 'Refined Wheat Flour (Maida), Sugar, Fractionated Palm Oil, Cocoa Solids (4.5%), Invert Sugar Syrup, Leavening Agents (500(ii), 503(ii)), Edible Common Salt, Emulsifier (322 - Soy Lecithin), Nature Identical Flavouring Substances (Vanilla).',
    ingredients: [
      { name: 'Refined Wheat Flour (Maida)', originalText: 'Refined Wheat Flour' },
      { name: 'Sugar', originalText: 'Sugar' },
      { name: 'Fractionated Palm Oil', originalText: 'Fractionated Palm Oil' },
      { name: 'Cocoa Solids', originalText: 'Cocoa Solids (4.5%)' },
      { name: 'Invert Sugar Syrup', originalText: 'Invert Sugar Syrup' },
      { name: 'Sodium Bicarbonate', originalText: 'Leavening Agent (500(ii))', eNumber: 'E500' },
      { name: 'Ammonium Bicarbonate', originalText: 'Leavening Agent (503(ii))', eNumber: 'E503' },
      { name: 'Salt', originalText: 'Edible Common Salt' },
      { name: 'Soy Lecithin', originalText: 'Emulsifier (322)', eNumber: 'E322' },
      { name: 'Vanilla Flavouring', originalText: 'Nature Identical Flavouring Substances' },
    ],
    nutritionPer100g: {
      calories: 483,
      totalFat: 19.8,
      saturatedFat: 9.6,
      transFat: 0.1,
      totalCarbs: 71.5,
      dietaryFibre: 2.8,
      totalSugar: 38.5,
      addedSugar: 36.0,
      protein: 5.2,
      sodium: 460,
    },
  },

  // ─── 5. Maggi 2-Minute Noodles Masala ─────────────────────────────────────
  {
    id: 'prod-maggi-masala',
    barcode: '8901058511875',
    name: 'Maggi 2-Minute Noodles Masala',
    brand: 'Maggi (Nestlé)',
    imageUrl: 'https://images.openfoodfacts.org/images/products/890/105/885/1328/front_en.17.400.jpg',
    servingSizeG: 70,
    nutriscore: 'd',
    source: 'cache',
    ingredientsRaw: 'Noodles: Refined wheat flour (Maida), Palm oil, Salt, Wheat gluten, Mineral (Calcium carbonate), Thickeners (508, 412), Acidity regulators (501(i), 500(i)), Humectant (451(i)). Masala Tastemaker: Hydrolysed groundnut protein, Mixed spices (Dehydrated onion, Coriander powder, Chilli powder, Turmeric powder, Garlic powder, Cumin powder, Aniseed, Black pepper, Fenugreek, Ginger, Clove, Nutmeg, Cardamom), Noodle powder, Sugar, Edible starch, Salt, Palm oil, Flavour enhancer (635), Acidity regulator (330), Mineral (Ferric pyrophosphate).',
    ingredients: [
      { name: 'Refined Wheat Flour (Maida)', originalText: 'Refined wheat flour' },
      { name: 'Palm Oil', originalText: 'Palm oil' },
      { name: 'Salt', originalText: 'Salt' },
      { name: 'Wheat Gluten', originalText: 'Wheat gluten' },
      { name: 'Guar Gum', originalText: 'Thickener (412)', eNumber: 'E412' },
      { name: 'Potassium Chloride', originalText: 'Mineral (508)', eNumber: 'E508' },
      { name: 'Mixed Spices', originalText: 'Mixed spices' },
      { name: 'Sugar', originalText: 'Sugar' },
      { name: 'Disodium 5-ribonucleotides', originalText: 'Flavour enhancer (635)', eNumber: 'E635' },
      { name: 'Citric Acid', originalText: 'Acidity regulator (330)', eNumber: 'E330' },
    ],
    nutritionPer100g: {
      calories: 427,
      totalFat: 15.7,
      saturatedFat: 6.8,
      transFat: 0.12,
      totalCarbs: 63.5,
      dietaryFibre: 3.6,
      totalSugar: 2.2,
      addedSugar: 1.1,
      protein: 8.0,
      sodium: 1230,
    },
  },

  // ─── 6. Parle-G Gluco Biscuits ───────────────────────────────────────────
  {
    id: 'prod-parle-g',
    barcode: '8901719101037',
    name: 'Parle-G Original Gluco Biscuits',
    brand: 'Parle',
    imageUrl: 'https://images.openfoodfacts.org/images/products/890/171/913/4845/front_en.11.400.jpg',
    servingSizeG: 25,
    nutriscore: 'e',
    source: 'cache',
    ingredientsRaw: 'Wheat Flour (67%), Sugar, Edible Vegetable Oil (Palm Oil), Invert Sugar Syrup, Raising Agents (503(ii), 500(ii)), Salt, Milk Solids (0.6%), Emulsifier (322 - Soy Lecithin), Dough Conditioner (223), Artificial Flavouring Substances (Vanilla).',
    ingredients: [
      { name: 'Wheat Flour', originalText: 'Wheat Flour (67%)' },
      { name: 'Sugar', originalText: 'Sugar' },
      { name: 'Palm Oil', originalText: 'Edible Vegetable Oil (Palm Oil)' },
      { name: 'Invert Sugar Syrup', originalText: 'Invert Sugar Syrup' },
      { name: 'Ammonium Bicarbonate', originalText: 'Raising Agent (503(ii))', eNumber: 'E503' },
      { name: 'Sodium Bicarbonate', originalText: 'Raising Agent (500(ii))', eNumber: 'E500' },
      { name: 'Salt', originalText: 'Salt' },
      { name: 'Milk Solids', originalText: 'Milk Solids (0.6%)' },
      { name: 'Soy Lecithin', originalText: 'Emulsifier (322)', eNumber: 'E322' },
      { name: 'Sodium Metabisulphite', originalText: 'Dough Conditioner (223)', eNumber: 'E223' },
    ],
    nutritionPer100g: {
      calories: 454,
      totalFat: 13.0,
      saturatedFat: 6.2,
      transFat: 0,
      totalCarbs: 77.5,
      dietaryFibre: 2.0,
      totalSugar: 25.5,
      addedSugar: 24.5,
      protein: 6.5,
      sodium: 290,
    },
  },

  // ─── 7. Britannia Good Day Butter Cookies ────────────────────────────────
  {
    id: 'prod-good-day-butter',
    barcode: '8901063101238',
    name: 'Britannia Good Day Butter Cookies',
    brand: 'Britannia',
    imageUrl: 'https://images.openfoodfacts.org/images/products/890/106/309/3522/front_en.28.400.jpg',
    servingSizeG: 20,
    nutriscore: 'e',
    source: 'cache',
    ingredientsRaw: 'Refined Wheat Flour (Maida), Sugar, Edible Vegetable Oil (Palm Oil), Butter (2%), Invert Sugar Syrup, Milk Solids, Raising Agents (503(ii), 500(ii)), Edible Common Salt, Emulsifiers (322, 471, 472e), Nature Identical Flavouring Substances (Butter).',
    ingredients: [
      { name: 'Refined Wheat Flour (Maida)', originalText: 'Refined Wheat Flour' },
      { name: 'Sugar', originalText: 'Sugar' },
      { name: 'Palm Oil', originalText: 'Edible Vegetable Oil (Palm Oil)' },
      { name: 'Butter', originalText: 'Butter (2%)' },
      { name: 'Invert Sugar Syrup', originalText: 'Invert Sugar Syrup' },
      { name: 'Milk Solids', originalText: 'Milk Solids' },
      { name: 'Raising Agents', originalText: 'Raising Agents (503(ii), 500(ii))' },
      { name: 'Salt', originalText: 'Edible Common Salt' },
      { name: 'Soy Lecithin', originalText: 'Emulsifier (322)', eNumber: 'E322' },
      { name: 'Mono- and Diglycerides', originalText: 'Emulsifier (471)', eNumber: 'E471' },
    ],
    nutritionPer100g: {
      calories: 492,
      totalFat: 21.0,
      saturatedFat: 10.5,
      transFat: 0.1,
      totalCarbs: 69.0,
      dietaryFibre: 1.8,
      totalSugar: 22.0,
      addedSugar: 21.0,
      protein: 7.0,
      sodium: 380,
    },
  },

  // ─── 8. Haldiram's Aloo Bhujia ───────────────────────────────────────────
  {
    id: 'prod-haldirams-aloo-bhujia',
    barcode: '8904063200021',
    name: "Haldiram's Nagpur Aloo Bhujia",
    brand: "Haldiram's",
    imageUrl: 'https://images.openfoodfacts.org/images/products/890/400/440/0731/front_en.28.400.jpg',
    servingSizeG: 30,
    nutriscore: 'e',
    source: 'cache',
    ingredientsRaw: 'Potatoes (44%), Edible Vegetable Oil (Palmolein Oil, Cotton Seed Oil), Gram Pulse Flour (12%), Tepary Beans (Moth Dal) Flour (2%), Edible Starch, Spices & Condiments (Coriander Powder, Cumin Powder, Dry Mango Powder, Red Chilli Powder, Black Pepper Powder, Clove Powder, Cardamom Powder, Nutmeg Powder, Cinnamon Powder), Edible Common Salt, Black Salt, Acidity Regulator (Citric Acid 330).',
    ingredients: [
      { name: 'Potatoes', originalText: 'Potatoes (44%)' },
      { name: 'Palmolein Oil', originalText: 'Edible Vegetable Oil (Palmolein Oil)' },
      { name: 'Gram Flour (Besan)', originalText: 'Gram Pulse Flour (12%)' },
      { name: 'Moth Dal Flour', originalText: 'Tepary Beans Flour (2%)' },
      { name: 'Spices and Condiments', originalText: 'Spices & Condiments' },
      { name: 'Salt', originalText: 'Edible Common Salt' },
      { name: 'Black Salt', originalText: 'Black Salt' },
      { name: 'Citric Acid', originalText: 'Acidity Regulator (330)', eNumber: 'E330' },
    ],
    nutritionPer100g: {
      calories: 578,
      totalFat: 42.0,
      saturatedFat: 18.0,
      transFat: 0.1,
      totalCarbs: 42.5,
      dietaryFibre: 4.5,
      totalSugar: 2.0,
      addedSugar: 0.5,
      protein: 7.5,
      sodium: 760,
    },
  },

  // ─── 9. Cadbury Dairy Milk Chocolate ─────────────────────────────────────
  {
    id: 'prod-cadbury-dairy-milk',
    barcode: '7622210817020',
    name: 'Cadbury Dairy Milk Chocolate Bar',
    brand: 'Cadbury (Mondelez)',
    imageUrl: 'https://images.openfoodfacts.org/images/products/762/221/081/7020/front_en.14.400.jpg',
    servingSizeG: 20,
    nutriscore: 'e',
    source: 'cache',
    ingredientsRaw: 'Sugar, Milk Solids (22%), Cocoa Butter, Cocoa Solids, Emulsifiers (442, 476), Flavours (Natural, Nature Identical and Artificial Vanilla Flavouring Substances).',
    ingredients: [
      { name: 'Sugar', originalText: 'Sugar' },
      { name: 'Milk Solids', originalText: 'Milk Solids (22%)' },
      { name: 'Cocoa Butter', originalText: 'Cocoa Butter' },
      { name: 'Cocoa Solids', originalText: 'Cocoa Solids' },
      { name: 'Ammonium Phosphatides', originalText: 'Emulsifier (442)', eNumber: 'E442' },
      { name: 'Polyglycerol Polyricinoleate', originalText: 'Emulsifier (476)', eNumber: 'E476' },
      { name: 'Vanilla Flavour', originalText: 'Flavours (Vanilla)' },
    ],
    nutritionPer100g: {
      calories: 532,
      totalFat: 30.5,
      saturatedFat: 18.6,
      transFat: 0.2,
      totalCarbs: 57.8,
      dietaryFibre: 2.1,
      totalSugar: 56.0,
      addedSugar: 46.5,
      protein: 7.8,
      sodium: 145,
    },
  },

  // ─── 10. Bingo! Mad Angles Achaari Masti ─────────────────────────────────
  {
    id: 'prod-bingo-mad-angles',
    barcode: '8901725131035',
    name: 'Bingo! Mad Angles Achaari Masti Corn Chips',
    brand: 'Bingo! (ITC)',
    imageUrl: 'https://images.openfoodfacts.org/images/products/890/172/513/1035/front_en.11.400.jpg',
    servingSizeG: 20,
    nutriscore: 'e',
    source: 'cache',
    ingredientsRaw: 'Rice Grits, Seasoning Mix (Refined Palmolein, Spices and Condiments, Iodized Salt, Black Salt, Refined Sugar, Acidity Regulators (INS 330, INS 296), Flavour Enhancers (INS 627, INS 631), Anticaking Agent (INS 551)), Refined Palmolein, Corn Grits, Gram Grits.',
    ingredients: [
      { name: 'Rice Grits', originalText: 'Rice Grits' },
      { name: 'Refined Palmolein', originalText: 'Refined Palmolein' },
      { name: 'Spices and Condiments', originalText: 'Spices and Condiments' },
      { name: 'Salt', originalText: 'Iodized Salt' },
      { name: 'Black Salt', originalText: 'Black Salt' },
      { name: 'Sugar', originalText: 'Refined Sugar' },
      { name: 'Citric Acid', originalText: 'Acidity Regulator (INS 330)', eNumber: 'E330' },
      { name: 'Malic Acid', originalText: 'Acidity Regulator (INS 296)', eNumber: 'E296' },
      { name: 'Flavour Enhancers', originalText: 'Flavour Enhancers (INS 627, INS 631)', eNumber: 'E627' },
      { name: 'Silicon Dioxide', originalText: 'Anticaking Agent (INS 551)', eNumber: 'E551' },
      { name: 'Corn Grits', originalText: 'Corn Grits' },
    ],
    nutritionPer100g: {
      calories: 541,
      totalFat: 31.8,
      saturatedFat: 14.5,
      transFat: 0.1,
      totalCarbs: 58.2,
      dietaryFibre: 3.1,
      totalSugar: 2.8,
      addedSugar: 1.9,
      protein: 5.6,
      sodium: 840,
    },
  },

  // ─── 11. Balaji Simply Salted Potato Wafers ──────────────────────────────
  {
    id: 'prod-balaji-simply-salted',
    barcode: '8906014460012',
    name: 'Balaji Wafers Simply Salted Potato Chips',
    brand: 'Balaji Wafers',
    imageUrl: 'https://images.openfoodfacts.org/images/products/890/601/446/0012/front_en.11.400.jpg',
    servingSizeG: 25,
    nutriscore: 'd',
    source: 'cache',
    ingredientsRaw: 'Potatoes (87%), Edible Vegetable Oil (Palmolein Oil, Cottonseed Oil), Edible Common Salt (Rock Salt 1.5%).',
    ingredients: [
      { name: 'Potatoes', originalText: 'Potatoes (87%)' },
      { name: 'Palmolein Oil', originalText: 'Edible Vegetable Oil (Palmolein Oil)' },
      { name: 'Rock Salt', originalText: 'Edible Common Salt (Rock Salt 1.5%)' },
    ],
    nutritionPer100g: {
      calories: 554,
      totalFat: 35.0,
      saturatedFat: 15.0,
      transFat: 0.1,
      totalCarbs: 52.0,
      dietaryFibre: 4.0,
      totalSugar: 0.5,
      addedSugar: 0,
      protein: 7.2,
      sodium: 520,
    },
  },

  // ─── 12. Sunfeast Dark Fantasy Choco Fills ───────────────────────────────
  {
    id: 'prod-dark-fantasy',
    barcode: '8901725181214',
    name: 'Sunfeast Dark Fantasy Choco Fills Biscuits',
    brand: 'Sunfeast (ITC)',
    imageUrl: 'https://images.openfoodfacts.org/images/products/890/172/518/1214/front_en.12.400.jpg',
    servingSizeG: 25,
    nutriscore: 'e',
    source: 'cache',
    ingredientsRaw: 'Choco Cream (38%) (Sugar, Edible Vegetable Oil (Hydrogenated), Cocoa Solids, Emulsifier (INS 322)), Refined Wheat Flour (Maida), Hydrogenated Vegetable Oil, Sugar, Invert Sugar Syrup, Cocoa Solids (0.7%), Raising Agents (INS 503(ii), INS 500(ii)), Edible Common Salt, Emulsifier (INS 322).',
    ingredients: [
      { name: 'Sugar', originalText: 'Sugar' },
      { name: 'Refined Wheat Flour (Maida)', originalText: 'Refined Wheat Flour' },
      { name: 'Hydrogenated Vegetable Oil', originalText: 'Hydrogenated Vegetable Oil' },
      { name: 'Cocoa Solids', originalText: 'Cocoa Solids' },
      { name: 'Invert Sugar Syrup', originalText: 'Invert Sugar Syrup' },
      { name: 'Soy Lecithin', originalText: 'Emulsifier (INS 322)', eNumber: 'E322' },
      { name: 'Raising Agents', originalText: 'Raising Agents (INS 503(ii), INS 500(ii))' },
      { name: 'Salt', originalText: 'Edible Common Salt' },
    ],
    nutritionPer100g: {
      calories: 512,
      totalFat: 26.8,
      saturatedFat: 13.5,
      transFat: 0.4,
      totalCarbs: 62.0,
      dietaryFibre: 2.2,
      totalSugar: 36.5,
      addedSugar: 34.0,
      protein: 5.5,
      sodium: 210,
    },
  },

  // ─── 13. Crax Corn Rings Tangy Tomato ────────────────────────────────────
  {
    id: 'prod-crax-rings',
    barcode: '8901725121029',
    name: 'Crax Corn Rings Tangy Tomato',
    brand: 'Crax (DFM Foods)',
    imageUrl: 'https://images.openfoodfacts.org/images/products/890/172/512/1029/front_en.10.400.jpg',
    servingSizeG: 20,
    nutriscore: 'd',
    source: 'cache',
    isVegetarian: true,
    ingredientsRaw: 'Corn Grits (60%), Edible Vegetable Oil (Refined Palmolein Oil), Seasoning (Sugar, Salt, Tomato Powder, Onion Powder, Garlic Powder, Spices and Condiments, Acidity Regulator (INS 330), Flavour Enhancers (INS 627, INS 631), Anticaking Agent (INS 551)).',
    ingredients: [
      { name: 'Corn Grits', originalText: 'Corn Grits (60%)' },
      { name: 'Palmolein Oil', originalText: 'Refined Palmolein Oil' },
      { name: 'Sugar', originalText: 'Sugar' },
      { name: 'Salt', originalText: 'Salt' },
      { name: 'Tomato Powder', originalText: 'Tomato Powder' },
      { name: 'Citric Acid', originalText: 'Acidity Regulator (INS 330)', eNumber: 'E330' },
      { name: 'Flavour Enhancers', originalText: 'Flavour Enhancers (INS 627, INS 631)', eNumber: 'E627' },
      { name: 'Silicon Dioxide', originalText: 'Anticaking Agent (INS 551)', eNumber: 'E551' },
    ],
    nutritionPer100g: {
      calories: 498,
      totalFat: 23.5,
      saturatedFat: 10.2,
      transFat: 0.1,
      totalCarbs: 65.4,
      dietaryFibre: 3.2,
      totalSugar: 5.4,
      addedSugar: 4.2,
      protein: 6.2,
      sodium: 680,
    },
  },

  // ─── 14. Coca-Cola India (FSSAI Certified) ────────────────────────────────
  {
    id: 'prod-coca-cola-india',
    barcode: '8901764012234',
    name: 'Coca-Cola Original (India)',
    brand: 'Coca-Cola India',
    imageUrl: 'https://images.openfoodfacts.org/images/products/544/900/000/0996/front_en.1082.400.jpg',
    servingSizeG: 200,
    nutriscore: 'e',
    source: 'cache',
    isVegetarian: true,
    ingredientsRaw: 'Carbonated Water, Sugar, Acidity Regulator (INS 338), Colour (INS 150d), Flavours (Natural Flavouring Substances), Caffeine (Contains added caffeine).',
    ingredients: [
      { name: 'Carbonated Water', originalText: 'Carbonated Water' },
      { name: 'Sugar', originalText: 'Sugar' },
      { name: 'Phosphoric Acid', originalText: 'Acidity Regulator (INS 338)', eNumber: 'E338' },
      { name: 'Caramel IV', originalText: 'Colour (INS 150d)', eNumber: 'E150d' },
      { name: 'Natural Flavours', originalText: 'Natural Flavouring Substances' },
      { name: 'Caffeine', originalText: 'Contains added caffeine' },
    ],
    nutritionPer100g: {
      calories: 44,
      totalFat: 0,
      saturatedFat: 0,
      transFat: 0,
      totalCarbs: 10.6,
      dietaryFibre: 0,
      totalSugar: 10.6,
      addedSugar: 10.6,
      protein: 0,
      sodium: 12,
    },
  },

  // ─── 15. Thums Up (Charged / Strong Cola India) ───────────────────────────
  {
    id: 'prod-thums-up',
    barcode: '8901764012296',
    name: 'Thums Up Charged Cola',
    brand: 'Thums Up (Coca-Cola India)',
    imageUrl: 'https://images.openfoodfacts.org/images/products/890/176/401/2296/front_en.12.400.jpg',
    servingSizeG: 250,
    nutriscore: 'e',
    source: 'cache',
    isVegetarian: true,
    ingredientsRaw: 'Carbonated Water, Sugar, Acidity Regulator (INS 338), Colour (INS 150d), Flavours (Natural Flavouring Substances), Caffeine (High caffeine content 145mg/kg).',
    ingredients: [
      { name: 'Carbonated Water', originalText: 'Carbonated Water' },
      { name: 'Sugar', originalText: 'Sugar' },
      { name: 'Phosphoric Acid', originalText: 'Acidity Regulator (INS 338)', eNumber: 'E338' },
      { name: 'Caramel IV', originalText: 'Colour (INS 150d)', eNumber: 'E150d' },
      { name: 'Natural Flavours', originalText: 'Natural Flavouring Substances' },
      { name: 'Caffeine', originalText: 'Caffeine (145mg/kg)' },
    ],
    nutritionPer100g: {
      calories: 40,
      totalFat: 0,
      saturatedFat: 0,
      transFat: 0,
      totalCarbs: 10.0,
      dietaryFibre: 0,
      totalSugar: 10.0,
      addedSugar: 10.0,
      protein: 0,
      sodium: 14,
    },
  },

  // ─── 16. Farmley Roasted Makhana Himalayan Salt ───────────────────────────
  {
    id: 'prod-farmley-makhana',
    barcode: '8906132470014',
    name: 'Farmley Roasted Makhana (Himalayan Pink Salt)',
    brand: 'Farmley',
    imageUrl: 'https://images.openfoodfacts.org/images/products/890/149/100/1021/front_en.3.400.jpg',
    servingSizeG: 30,
    nutriscore: 'a',
    source: 'cache',
    isVegetarian: true,
    ingredientsRaw: 'Foxnuts (Makhana 85%), Olive Oil (10%), Himalayan Pink Salt (3%), Black Pepper.',
    ingredients: [
      { name: 'Foxnuts (Makhana)', originalText: 'Makhana (Foxnuts 85%)' },
      { name: 'Olive Oil', originalText: 'Olive Oil (10%)' },
      { name: 'Himalayan Pink Salt', originalText: 'Himalayan Pink Salt (3%)' },
      { name: 'Black Pepper', originalText: 'Black Pepper' },
    ],
    nutritionPer100g: {
      calories: 380,
      totalFat: 9.0,
      saturatedFat: 1.5,
      transFat: 0,
      totalCarbs: 64.0,
      dietaryFibre: 14.0,
      totalSugar: 0.5,
      addedSugar: 0,
      protein: 10.5,
      sodium: 320,
    },
  },
  // ─── 16. Quaker Rolled Oats 1kg ───────────────────────────────────────────
  {
    id: 'prod-quaker-oats-1kg',
    barcode: '5000108022152',
    name: 'Quaker Wholegrain Rolled Porridge Oats 1kg',
    brand: 'Quaker (PepsiCo)',
    imageUrl: 'https://images.openfoodfacts.org/images/products/500/010/802/2152/front_en.112.400.jpg',
    servingSizeG: 40,
    nutriscore: 'a',
    source: 'cache',
    isVegetarian: true,
    ingredientsRaw: '100% Wholegrain Rolled Oats.',
    ingredients: [
      { name: '100% Wholegrain Rolled Oats', originalText: '100% Wholegrain Rolled Oats' },
    ],
    nutritionPer100g: {
      calories: 375,
      totalFat: 8.0,
      saturatedFat: 1.5,
      transFat: 0,
      totalCarbs: 60.0,
      dietaryFibre: 9.0,
      totalSugar: 1.0,
      addedSugar: 0,
      protein: 11.0,
      sodium: 8,
    },
  },
];

// Mapping of alternative barcodes / common scan variations to products
export const BARCODE_ALIASES: Record<string, string> = {
  // Kurkure aliases
  '8901491100519': 'prod-kurkure-masala-munch',
  '8901491361026': 'prod-kurkure-masala-munch',
  '8901491001168': 'prod-kurkure-masala-munch',
  '8901491501946': 'prod-kurkure-masala-munch',
  '8901491000963': 'prod-kurkure-masala-munch',
  '8901491100526': 'prod-kurkure-masala-munch',

  // Lay's Magic Masala aliases
  '8901491101837': 'prod-lays-magic-masala',
  '8901491000840': 'prod-lays-magic-masala',
  '8901491101851': 'prod-lays-magic-masala',

  // Lay's Classic aliases
  '8901491001021': 'prod-lays-classic',
  '8901491502016': 'prod-lays-classic',
  '0028400200592': 'prod-lays-classic',
  '028400200592': 'prod-lays-classic',
  '028400064057': 'prod-lays-classic',
  '0028400064057': 'prod-lays-classic',
  '28400064057': 'prod-lays-classic',
  '8901491101813': 'prod-lays-classic',

  // Oreo aliases (including the one the user scanned!)
  '044000030148': 'prod-oreo-vanilla',
  '0044000030148': 'prod-oreo-vanilla',
  '44000030148': 'prod-oreo-vanilla',
  '762202225512': 'prod-oreo-vanilla',
  '7622202225512': 'prod-oreo-vanilla',
  '7622300336738': 'prod-oreo-vanilla',
  '6111031005590': 'prod-oreo-vanilla',
  '8901233024893': 'prod-oreo-vanilla',

  // Maggi aliases
  '8901058511875': 'prod-maggi-masala',
  '8901058851328': 'prod-maggi-masala',
  '8901058852893': 'prod-maggi-masala',
  '8901058863646': 'prod-maggi-masala',
  '8901058852886': 'prod-maggi-masala',

  // Parle-G aliases
  '8901719101037': 'prod-parle-g',
  '8901719134845': 'prod-parle-g',
  '8901719134852': 'prod-parle-g',
  '8901719101013': 'prod-parle-g',
  '8901719101020': 'prod-parle-g',

  // Good Day aliases
  '8901063101238': 'prod-good-day-butter',
  '8901063093522': 'prod-good-day-butter',
  '8901063012220': 'prod-good-day-butter',

  // Haldiram's Aloo Bhujia
  '8904063200021': 'prod-haldirams-aloo-bhujia',
  '8904004400731': 'prod-haldirams-aloo-bhujia',
  '8904063200113': 'prod-haldirams-aloo-bhujia',
  '8904063200014': 'prod-haldirams-aloo-bhujia',

  // Cadbury Dairy Milk
  '7622210817020': 'prod-cadbury-dairy-milk',
  '8901233010018': 'prod-cadbury-dairy-milk',

  // Bingo
  '8901725131035': 'prod-bingo-mad-angles',
  '8901725132049': 'prod-bingo-mad-angles',

  // Balaji
  '8906014460012': 'prod-balaji-simply-salted',
  '8906014460029': 'prod-balaji-simply-salted',

  // Dark Fantasy
  '8901725181214': 'prod-dark-fantasy',

  // Crax
  '8901725121029': 'prod-crax-rings',

  // Coca-Cola India (and global alias for convenience)
  '8901764012234': 'prod-coca-cola-india',
  '5449000000996': 'prod-coca-cola-india',

  // Thums Up
  '8901764012296': 'prod-thums-up',

  // Farmley Makhana
  '8906132470014': 'prod-farmley-makhana',

  // Quaker Oats (PepsiCo)
  '5000108022152': 'prod-quaker-oats-1kg',
  '05000108022152': 'prod-quaker-oats-1kg',
};

export function findInCatalog(barcode: string): Product | null {
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



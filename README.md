# 🍎 FoodLens — Food Ingredient & Nutrition Intelligence Platform

> Scan any packaged snack barcode (chips, Kurkure, biscuits, noodles) and get comprehensive ingredient intelligence, quantity breakdowns, evidence-based risk profiles, side-by-side product comparisons, and AI food assistance in English and Hindi.

Built for **Web** (Next.js 15 + Tailwind CSS) and **Mobile** (React Native + Expo), powered by a unified Node.js / Express backend with Open Food Facts and Google Gemini AI.

---

## 🌟 The 6 Interconnected Systems

```
┌────────────────────────────────────────────────────────────────────────┐
│                              FOODLENS                                  │
├────────────────────────────────────────────────────────────────────────┤
│  1. Barcode Resolver          2. Quantity Intelligence Engine          │
│     (Cache → DB → Open Food)     (Calories, Fat, Sugar, Sodium, DV%)   │
│                                                                        │
│  3. Ingredient Intelligence   4. Risk & Benefit Intelligence           │
│     (E-numbers, category,        (Evidence grade A–D, safety profile,  │
│      FSSAI/FDA status)            health concerns & benefits)          │
│                                                                        │
│  5. Product Comparison Engine 6. AI Food Assistant                     │
│     (Side-by-side nutrition      (Gemini 1.5 Flash, context-aware,     │
│      winner calculation)          English & Hindi queries)             │
└────────────────────────────────────────────────────────────────────────┘
```

### A. Ingredient Intelligence Engine
- Breaks down every ingredient and additive (E-numbers like E621, E211, E330, E471).
- Answers: What is it? Why is it used? (Preservative, emulsifier, flavour enhancer, nutrient).
- Checks regulatory standards from **FSSAI** (India), **FDA** (US), and **EFSA** (EU).

### B. Quantity Intelligence Module
- Visual traffic-light color system (🟢 Low · 🟡 Medium · 🔴 High) based on WHO & FSSAI thresholds.
- Tracks: Calories, Total Fat, Saturated Fat, Trans Fat, Total Sugar, Added Sugar, Sodium, Protein, Dietary Fibre, Carbohydrates.
- Computes an overall 0–100 health score with bonus/penalty weights.

### C. Ingredient Risk & Benefit Intelligence
- Every flagged additive receives an evidence grade (A to D).
- Highlights established benefits (e.g. natural antioxidant, mineral retention) vs. potential concerns (e.g. hyperactivity in children, dental erosion, cardiovascular risk).

### D. Product Comparison Engine
- Compares 2 or 3 snacks side-by-side.
- Highlights winners for each nutrient category and declares the healthier choice.

### E. AI Food Assistant
- Chat interface powered by Google Gemini Flash (`@google/generative-ai`).
- Answers queries using real scanned nutrition facts:
  - *"Is this okay to eat occasionally?"*
  - *"Which ingredient should I pay attention to?"*
  - *"Explain this in simple Hindi (Yeh product Hindi mein samjhao)"*
  - *"Why does this product have so much sodium?"*

---

## 🚀 Quick Start Guide

### 1. Test the Pipeline Right Now (CLI Verification)
Run the automated end-to-end test script to verify all 6 engines resolving real snack data:
```bash
npm run test:pipeline
```

### 2. Start the Backend API
```bash
cd backend
# Optional: create .env from .env.example (GEMINI_API_KEY, DATABASE_URL)
npm run dev
```
*Backend runs on `http://localhost:4000`.*

### 3. Start the Web App
In a new terminal:
```bash
cd apps/web
npm run dev
```
*Open `http://localhost:3000` in your browser.*
- **Camera Scan**: Uses your webcam / phone camera via `@zxing/browser`.
- **Manual Barcode**: Enter any barcode number or click the demo buttons.
- **Compare**: Go to `/compare` to compare 2–3 products.
- **History**: Go to `/history` to see recent scans.

### 4. Start the Mobile App (Expo)
In a new terminal:
```bash
cd apps/mobile
npx expo start
```
- Scan the QR code with **Expo Go** on your iPhone or Android phone.
- Uses native camera barcode scanning with haptic feedback!

---

## 📱 Barcodes to Test Right Away

| Product | Barcode | Highlights |
|---|---|---|
| **Lay's Classic Potato Chips** | `028400064057` | High sodium, saturated fat, low sugar |
| **Oreo Sandwich Cookies** | `044000030148` | High sugar, emulsifiers (soy lecithin) |
| **Maggi 2-Minute Noodles** | `8901058511875` | Palm oil, flavour enhancers (E635/E627), sodium |
| **Doritos Nacho Cheese** | `028400090896` | Multiple colorings (Yellow 5, Yellow 6, Red 40) |

---

## 📁 Repository Structure

```
FoodLens/
├── apps/
│   ├── web/                     # Next.js 15 Web Application
│   │   ├── src/app/             # App router pages (/, /product, /compare, /history)
│   │   └── src/components/      # Scanner, NutritionPanel, IngredientsList, AiChat
│   │
│   └── mobile/                  # React Native + Expo Mobile Application
│       ├── app/(tabs)/          # Tabs (Scan, Compare, History)
│       └── app/product/         # Product detail screen
│
├── packages/
│   └── core/                    # Shared TypeScript library
│       ├── src/types.ts         # Nutrition, Ingredient, & Comparison types
│       ├── src/nutrientScoring.ts # WHO/FSSAI traffic light algorithms
│       └── src/openFoodFacts.ts # Open Food Facts API client
│
├── backend/                     # Node.js + Express API server
│   ├── src/services/            # BarcodeResolver, IngredientEngine, AI Assistant
│   ├── src/routes/              # /api/barcode, /api/product, /api/compare, /api/ai
│   ├── src/data/                # Curated additive knowledge base
│   └── src/db/                  # PostgreSQL schema & seed script
│
└── turbo.json                   # Turborepo pipeline configuration
```

---

## 🔑 Environment Variables (Optional Enhancements)

Create `backend/.env`:
```env
# Google Gemini API key for the AI Food Assistant
GEMINI_API_KEY=your_gemini_api_key

# PostgreSQL database (Supabase or local PostgreSQL)
DATABASE_URL=postgresql://postgres:password@localhost:5432/foodlens

# Redis cache (Upstash or local Redis - optional, has in-memory fallback)
REDIS_URL=redis://localhost:6379
```
*Note: FoodLens works immediately out of the box even without PostgreSQL or Redis thanks to automatic in-memory caching and built-in curated knowledge base fallbacks!*


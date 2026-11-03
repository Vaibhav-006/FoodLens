'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Share2, Sparkles, ChevronRight, Scale, ShieldAlert, Flame, Zap } from 'lucide-react';
import type { Product, NutrientScore } from '@foodlens/core';
import { IngredientsList } from './IngredientsList';
import { AiChat } from './AiChat';
import { ProductImage } from './ProductImage';

interface ScanResultViewProps {
  product: Product;
  nutrientScores: NutrientScore[];
  overallScore: number;
}

const HEALTHIER_ALTERNATIVES = [
  {
    name: 'Roasted Makhana (Himalayan Pink Salt)',
    brand: 'Farmley / Healthy Treat',
    score: 91,
    scoreLabel: 'Superb',
    cal: '380 kcal',
    protein: '9.5g',
    barcode: '8906014460012',
    image: 'https://images.openfoodfacts.org/images/products/890/149/100/1021/front_en.3.400.jpg',
    fallbackIcon: '🫘',
  },
  {
    name: 'Whole Wheat Methi Khakhra (Roasted)',
    brand: 'Maniarrs / Real Namkeen',
    score: 84,
    scoreLabel: 'Excellent',
    cal: '410 kcal',
    protein: '11.0g',
    barcode: '8901063101238',
    image: 'https://images.openfoodfacts.org/images/products/890/106/309/3522/front_en.28.400.jpg',
    fallbackIcon: '🫓',
  },
  {
    name: 'Roasted Chana (Bengal Gram with Skin)',
    brand: 'Haldiram / Local',
    score: 88,
    scoreLabel: 'Excellent',
    cal: '360 kcal',
    protein: '18.5g',
    barcode: '8901491100519',
    image: 'https://images.openfoodfacts.org/images/products/890/149/110/0519/front_en.48.400.jpg',
    fallbackIcon: '🟤',
  },
];

/** SVG circular score gauge */
function ScoreGauge({ score }: { score: number }) {
  const isGood = score >= 60;
  const isOk = score >= 45 && score < 60;
  const color = isGood ? '#22c55e' : isOk ? '#f59e0b' : '#ef4444';
  const label = isGood ? 'Excellent' : isOk ? 'Moderate' : 'Poor';
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
          {/* Track */}
          <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          {/* Progress */}
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white leading-none">{score}</span>
          <span className="text-[10px] font-bold text-[#86efac] leading-none mt-0.5">/ 100</span>
        </div>
      </div>
      <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}>
        {label}
      </span>
    </div>
  );
}

export function ScanResultView({ product, nutrientScores, overallScore }: ScanResultViewProps) {
  const [activeTab, setActiveTab] = useState<'nutrition' | 'ingredients' | 'ai'>('nutrition');
  const router = useRouter();

  const isGood = overallScore >= 60;
  const isOk = overallScore >= 45 && overallScore < 60;
  const scoreColor = isGood ? '#22c55e' : isOk ? '#f59e0b' : '#ef4444';

  // Categorize nutrients
  const negatives = nutrientScores.filter((s) =>
    ['totalFat', 'saturatedFat', 'transFat', 'totalSugar', 'addedSugar', 'sodium'].includes(s.nutrient)
  );
  const positives = nutrientScores.filter((s) =>
    ['protein', 'dietaryFibre'].includes(s.nutrient)
  );

  // Exact reference Daily Values (ICMR-NIN & FSSAI / WHO 2,000 kcal diet)
  const DAILY_LIMITS: Record<string, number> = {
    totalFat: 65,
    saturatedFat: 20,
    transFat: 2,
    totalSugar: 50,
    addedSugar: 25,
    sodium: 2000,
    protein: 50,
    dietaryFibre: 30,
    calories: 2000,
  };

  const getProgressWidth = (nutrient: string, val: number | null, dvPercent: number | null) => {
    if (val === null || val === undefined || val <= 0) return '0%';
    const target = DAILY_LIMITS[nutrient] || 100;
    const pct = dvPercent !== null && dvPercent !== undefined ? dvPercent : Math.round((val / target) * 100);
    return `${Math.min(100, Math.max(3, pct))}%`;
  };

  const caloriesVal = product.nutritionPer100g.calories ?? 0;
  const caloriePercent = Math.min(100, Math.round((caloriesVal / 2000) * 100));

  const HFSS =
    (product.nutritionPer100g.totalFat ?? 0) > 17.5 ||
    (product.nutritionPer100g.totalSugar ?? 0) > 12.5 ||
    (product.nutritionPer100g.sodium ?? 0) > 600;

  return (
    <div className="space-y-6">
      {/* ─── Top Bar ─────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold transition-colors"
          style={{ color: '#4b7a5e' }}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center gap-2">
          <Link
            href="/compare"
            className="text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"
            style={{ background: 'rgba(34,197,94,0.08)', color: '#86efac', border: '1px solid rgba(34,197,94,0.18)' }}
          >
            <Scale className="w-3.5 h-3.5" /> Compare
          </Link>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: product.name, url: window.location.href });
              }
            }}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#86efac' }}
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── Main Grid ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: Product Card */}
        <div className="lg:col-span-4 space-y-4">

          {/* Product Hero Card */}
          <div className="rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(160deg, #0d1f11 0%, #111a14 100%)', border: '1px solid rgba(34,197,94,0.15)' }}>
            {/* Product image area */}
            <div className="relative flex items-center justify-center pt-8 pb-4 px-8" style={{ background: 'radial-gradient(ellipse at center, rgba(34,197,94,0.08) 0%, transparent 70%)' }}>
              <div className="w-36 h-36 flex items-center justify-center">
                <ProductImage
                  src={product.imageUrl}
                  alt={product.name}
                  fallbackIcon={'📦'}
                  className="max-h-32 max-w-full object-contain drop-shadow-2xl"
                />
              </div>
            </div>

            <div className="px-6 pb-6 space-y-4">
              {/* Veg/non-veg badge */}
              <div className="flex items-center gap-2">
                <div
                  className="w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center"
                  style={{ borderColor: product.isVegetarian !== false ? '#22c55e' : '#ef4444' }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: product.isVegetarian !== false ? '#22c55e' : '#ef4444' }}
                  />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#4b7a5e' }}>
                  {product.isVegetarian !== false ? 'Vegetarian · FSSAI' : 'Non-Vegetarian'}
                </span>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#4b7a5e' }}>{product.brand ?? 'Packaged Food'}</p>
                <h1 className="text-lg font-black text-white mt-1 leading-snug">{product.name}</h1>
                <p className="text-[11px] font-mono mt-1" style={{ color: '#2d5236' }}>{product.barcode}</p>
              </div>

              {/* Score Gauge */}
              <div className="flex justify-center py-2">
                <ScoreGauge score={overallScore} />
              </div>

              {/* HFSS Warning */}
              {HFSS && (
                <div className="flex items-start gap-2.5 rounded-2xl p-3" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: '#fbbf24' }}>FSSAI HFSS Alert</p>
                    <p className="text-[11px] mt-0.5 leading-tight" style={{ color: '#d97706' }}>High Fat, Sugar, or Sodium per Indian food safety thresholds.</p>
                  </div>
                </div>
              )}

              {/* Macro Trio */}
              <div className="grid grid-cols-3 gap-2 pt-2" style={{ borderTop: '1px solid rgba(34,197,94,0.1)' }}>
                {[
                  { label: 'Calories', val: `${product.nutritionPer100g.calories ?? '–'} kcal`, icon: <Flame className="w-3 h-3" /> },
                  { label: 'Protein', val: `${product.nutritionPer100g.protein ?? '–'}g`, icon: <Zap className="w-3 h-3" /> },
                  { label: 'Total Fat', val: `${product.nutritionPer100g.totalFat ?? '–'}g`, icon: null },
                ].map((m, i) => (
                  <div key={i} className="rounded-xl p-2.5 text-center" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.08)' }}>
                    <span className="text-[9px] font-bold uppercase tracking-wider block" style={{ color: '#4b7a5e' }}>{m.label}</span>
                    <p className="text-xs font-extrabold text-white mt-0.5">{m.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Healthier Alternatives */}
          <div className="card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">Healthier Alternatives</h3>
              <span className="text-[10px] font-bold" style={{ color: '#22c55e' }}>Better Choices</span>
            </div>

            <div className="space-y-2">
              {HEALTHIER_ALTERNATIVES.map((alt, i) => (
                <Link
                  key={i}
                  href={`/product/${alt.barcode}`}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl transition-all group"
                  style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.08)' }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ background: 'rgba(34,197,94,0.06)' }}>
                      <ProductImage
                        src={alt.image}
                        alt={alt.name}
                        fallbackIcon={alt.fallbackIcon}
                        className="w-full h-full object-contain p-0.5"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate group-hover:text-[#86efac] transition-colors">{alt.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[10px]" style={{ color: '#4b7a5e' }}>
                        <span className="font-bold" style={{ color: '#22c55e' }}>{alt.score}</span>
                        <span>· {alt.cal}</span>
                        <span>· {alt.protein} prot</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" style={{ color: '#2d5236' }} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Analysis Tabs */}
        <div className="lg:col-span-8 space-y-5">

          {/* Tab Bar */}
          <div className="flex gap-1 p-1.5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(34,197,94,0.1)' }}>
            {[
              { id: 'nutrition', label: 'Nutrition & Traffic Lights' },
              { id: 'ingredients', label: `Ingredients & Additives (${product.ingredients.length})` },
              { id: 'ai', label: '✦ AI Assistant', highlight: true },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className="flex-1 py-2.5 text-xs font-bold rounded-xl transition-all"
                style={
                  activeTab === tab.id
                    ? {
                        background: tab.highlight ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'rgba(34,197,94,0.12)',
                        color: tab.highlight ? '#fff' : '#86efac',
                        border: '1px solid rgba(34,197,94,0.25)',
                      }
                    : { color: '#4b7a5e' }
                }
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── NUTRITION TAB ── */}
          {activeTab === 'nutrition' && (
            <div className="space-y-4">

              {/* Energy Card */}
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">Energy Density</h3>
                    <p className="text-[11px] mt-0.5" style={{ color: '#4b7a5e' }}>Per 100g vs 2,000 kcal daily target</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-white">{caloriesVal}</span>
                    <span className="text-xs font-bold ml-1" style={{ color: '#4b7a5e' }}>kcal</span>
                  </div>
                </div>
                <div className="h-2.5 rounded-full w-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-2.5 rounded-full"
                    style={{
                      width: `${caloriePercent}%`,
                      background: `linear-gradient(90deg, #22c55e, ${caloriePercent > 60 ? '#f59e0b' : '#22c55e'})`,
                      boxShadow: '0 0 10px rgba(34,197,94,0.4)',
                      transition: 'width 0.8s ease',
                    }}
                  />
                </div>
                <p className="text-[11px] mt-2 font-medium" style={{ color: '#4b7a5e' }}>{caloriePercent}% of 2,000 kcal daily allowance</p>
              </div>

              {/* Negatives */}
              <div className="card p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#ef4444', boxShadow: '0 0 6px #ef4444' }} />
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">Negatives · Health Watch</h3>
                    <p className="text-[11px] mt-0.5" style={{ color: '#4b7a5e' }}>Nutrients to limit — lower is better</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {negatives.map((s) => {
                    const isZero = (s.valuePer100g ?? 0) <= 0;
                    const pct = s.dailyValuePercent ?? 0;
                    const widthStyle = getProgressWidth(s.nutrient, s.valuePer100g, s.dailyValuePercent);
                    const barColor = isZero ? 'transparent' : s.trafficLight === 'red' ? '#ef4444' : s.trafficLight === 'amber' ? '#f59e0b' : '#22c55e';
                    const badgeText = isZero ? 'Zero · Safe 🟢' : s.trafficLight === 'red' ? 'High · Limit 🔴' : s.trafficLight === 'amber' ? 'Moderate 🟡' : 'Low · Safe 🟢';
                    const badgeStyle = isZero || s.trafficLight === 'green'
                      ? { background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }
                      : s.trafficLight === 'red'
                      ? { background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }
                      : { background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' };

                    return (
                      <div key={s.nutrient}>
                        <div className="flex items-center justify-between text-xs mb-2 flex-wrap gap-1.5">
                          <span className="font-semibold text-white">{s.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={badgeStyle}>{badgeText}</span>
                            <span className="text-[11px] font-medium" style={{ color: '#4b7a5e' }}>{pct}% DV</span>
                            <span className="font-bold text-white min-w-12 text-right">{s.valuePer100g !== null ? `${s.valuePer100g} ${s.unit}` : `0 ${s.unit}`}</span>
                          </div>
                        </div>
                        <div className="h-2 rounded-full w-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <div
                            className="h-2 rounded-full transition-all duration-700"
                            style={{ width: widthStyle, background: barColor, boxShadow: barColor !== 'transparent' ? `0 0 8px ${barColor}60` : 'none' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Positives */}
              <div className="card p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">Positives · Nutritional Benefits</h3>
                    <p className="text-[11px] mt-0.5" style={{ color: '#4b7a5e' }}>Beneficial nutrients — higher is better</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {positives.map((s) => {
                    const val = s.valuePer100g ?? 0;
                    const pct = s.dailyValuePercent ?? 0;
                    const widthStyle = getProgressWidth(s.nutrient, s.valuePer100g, s.dailyValuePercent);

                    let badgeText = 'Low Source';
                    let badgeStyle = { background: 'rgba(255,255,255,0.05)', color: '#4b7a5e', border: '1px solid rgba(255,255,255,0.08)' };
                    if (s.nutrient === 'protein') {
                      if (val >= 10) { badgeText = 'High Protein 🟢'; badgeStyle = { background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }; }
                      else if (val >= 5) { badgeText = 'Good Source 🟢'; badgeStyle = { background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }; }
                    } else if (s.nutrient === 'dietaryFibre') {
                      if (val >= 6) { badgeText = 'High Fibre 🟢'; badgeStyle = { background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }; }
                      else if (val >= 3) { badgeText = 'Good Source 🟢'; badgeStyle = { background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }; }
                    }

                    return (
                      <div key={s.nutrient}>
                        <div className="flex items-center justify-between text-xs mb-2 flex-wrap gap-1.5">
                          <span className="font-semibold text-white">{s.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={badgeStyle}>{badgeText}</span>
                            <span className="text-[11px] font-medium" style={{ color: '#4b7a5e' }}>{pct}% of Target</span>
                            <span className="font-bold text-white min-w-12 text-right">{val} {s.unit}</span>
                          </div>
                        </div>
                        <div className="h-2 rounded-full w-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <div
                            className="h-2 rounded-full transition-all duration-700"
                            style={{ width: widthStyle, background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.5)' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ── INGREDIENTS TAB ── */}
          {activeTab === 'ingredients' && (
            <div className="card p-5">
              <IngredientsList ingredients={product.ingredients} />
            </div>
          )}

          {/* ── AI TAB ── */}
          {activeTab === 'ai' && (
            <div className="card overflow-hidden" style={{ minHeight: '520px' }}>
              <AiChat product={product} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

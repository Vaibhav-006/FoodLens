'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Share2, Sparkles, ChevronRight, Scale, ShieldAlert, Flame, Zap, AlertCircle } from 'lucide-react';
import type { Product, NutrientScore } from '@foodlens/core';
import { IngredientsList } from './IngredientsList';
import { AiChat } from './AiChat';
import { ProductImage } from './ProductImage';

interface ScanResultViewProps {
  product: Product;
  nutrientScores: NutrientScore[];
  overallScore: number | null;
}

function formatNutrient(val: any): string {
  if (val === null || val === undefined) return '0';
  const clean = typeof val === 'string' ? parseFloat(val.replace(/[^0-9.-]/g, '')) : Number(val);
  if (isNaN(clean)) return '0';
  if (clean >= 100) return Math.round(clean).toString();
  return Number(clean.toFixed(1)).toString();
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
function ScoreGauge({ score }: { score: number | null }) {
  if (score === null || score === undefined) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-28 h-28">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={44} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-zinc-400 leading-none">—</span>
            <span className="text-[10px] font-bold text-zinc-500 leading-none mt-1">/ 100</span>
          </div>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full text-amber-400 bg-amber-500/10 border border-amber-500/30">
          Data Incomplete
        </span>
      </div>
    );
  }

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

  const isUnrated = overallScore === null;
  const isGood = overallScore !== null && overallScore >= 60;
  const isOk = overallScore !== null && overallScore >= 45 && overallScore < 60;
  const scoreColor = isUnrated ? '#a1a1aa' : isGood ? '#22c55e' : isOk ? '#f59e0b' : '#ef4444';

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

  const NEGATIVE_THRESHOLDS: Record<string, { green: number; amber: number }> = {
    totalFat: { green: 3, amber: 17.5 },
    saturatedFat: { green: 1.5, amber: 5 },
    transFat: { green: 0.1, amber: 0.5 },
    totalSugar: { green: 5, amber: 12.5 },
    addedSugar: { green: 2.5, amber: 10 },
    sodium: { green: 120, amber: 600 },
  };

  const getProgressWidth = (nutrient: string, val: any, dvPercent: number | null) => {
    const cleanNum = typeof val === 'string' ? parseFloat(val.replace(/[^0-9.-]/g, '')) : Number(val);
    if (isNaN(cleanNum) || cleanNum <= 0) return '0%';
    const target = DAILY_LIMITS[nutrient] || 100;
    const cleanDv = dvPercent !== null && dvPercent !== undefined && !isNaN(Number(dvPercent))
      ? Number(dvPercent)
      : Math.round((cleanNum / target) * 100);
    return `${Math.min(100, Math.max(3, cleanDv))}%`;
  };

  const rawCalories = product.nutritionPer100g.calories;
  const cleanCalories = rawCalories !== null && rawCalories !== undefined ? parseFloat(String(rawCalories).replace(/[^0-9.-]/g, '')) : null;
  const hasCalories = cleanCalories !== null && !isNaN(cleanCalories) && cleanCalories > 0;
  const caloriePercent = hasCalories ? Math.min(100, Math.round((cleanCalories / 2000) * 100)) : 0;

  const cleanFat = parseFloat(String(product.nutritionPer100g.totalFat ?? '').replace(/[^0-9.-]/g, ''));
  const cleanSugar = parseFloat(String(product.nutritionPer100g.totalSugar ?? '').replace(/[^0-9.-]/g, ''));
  const cleanSodium = parseFloat(String(product.nutritionPer100g.sodium ?? '').replace(/[^0-9.-]/g, ''));

  const HFSS =
    (!isNaN(cleanFat) && cleanFat > 17.5) ||
    (!isNaN(cleanSugar) && cleanSugar > 12.5) ||
    (!isNaN(cleanSodium) && cleanSodium > 600);

  const isIncomplete = isUnrated || product.ingredients.length === 0;

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

      {/* Incomplete Data Notice from Open Food Facts */}
      {isIncomplete && (
        <div className="rounded-2xl p-4 bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-amber-200 shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-300">
              Community Record: Incomplete Nutrition Data
            </h4>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              This barcode is registered on Open Food Facts, but its nutritional label and ingredients were not submitted by the contributor.
              PackTruth will not display misleading 100/100 or zero-calorie scores for missing data. You can ask our <strong className="text-white">✦ AI Assistant</strong> below to estimate typical ingredients and macros!
            </p>
          </div>
        </div>
      )}

      {/* ─── Main Grid ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: Product Card */}
        <div className="lg:col-span-4 space-y-4">

          {/* Product Hero Card */}
          <div className="rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(160deg, #0d1f11 0%, #111a14 100%)', border: '1px solid rgba(34,197,94,0.15)' }}>
            {/* Product image area */}
            <div className="relative flex items-center justify-center pt-5 pb-3 px-4 sm:pt-8 sm:pb-4 sm:px-8" style={{ background: 'radial-gradient(ellipse at center, rgba(34,197,94,0.08) 0%, transparent 70%)' }}>
              <div className="w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
                <ProductImage
                  src={product.imageUrl}
                  alt={product.name}
                  fallbackIcon={'📦'}
                  className="max-h-24 sm:max-h-32 max-w-full object-contain drop-shadow-2xl"
                />
              </div>
            </div>

            <div className="px-4 pb-5 sm:px-6 sm:pb-6 space-y-3.5 sm:space-y-4">
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
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  {product.isVegetarian !== false ? 'Vegetarian · FSSAI' : 'Non-Vegetarian'}
                </span>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{product.brand ?? 'Packaged Food'}</p>
                <h1 className="text-base sm:text-lg font-black text-white mt-0.5 leading-snug">{product.name}</h1>
                <p className="text-[10px] sm:text-[11px] font-mono mt-0.5 text-zinc-500">{product.barcode}</p>
              </div>

              {/* Score Gauge */}
              <div className="flex justify-center py-1 sm:py-2">
                <ScoreGauge score={overallScore} />
              </div>

              {/* HFSS Warning */}
              {HFSS && (
                <div className="flex items-start gap-2.5 rounded-2xl p-2.5 sm:p-3" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
                  <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">FSSAI HFSS Alert</p>
                    <p className="text-[11px] mt-0.5 leading-tight text-amber-200/90">High Fat, Sugar, or Sodium per Indian food safety thresholds.</p>
                  </div>
                </div>
              )}

              {/* Macro Trio */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-2" style={{ borderTop: '1px solid rgba(34,197,94,0.1)' }}>
                {[
                  {
                    label: 'Calories',
                    val: product.nutritionPer100g.calories != null ? `${formatNutrient(product.nutritionPer100g.calories)} kcal` : '–',
                  },
                  {
                    label: 'Protein',
                    val: product.nutritionPer100g.protein != null ? `${formatNutrient(product.nutritionPer100g.protein)}g` : '–',
                  },
                  {
                    label: 'Total Fat',
                    val: product.nutritionPer100g.totalFat != null ? `${formatNutrient(product.nutritionPer100g.totalFat)}g` : '–',
                  },
                ].map((m, i) => (
                  <div key={i} className="rounded-xl p-2 sm:p-2.5 text-center overflow-hidden" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.08)' }}>
                    <span className="text-[9px] font-bold uppercase tracking-wider block truncate text-zinc-400">{m.label}</span>
                    <p className="text-xs sm:text-sm font-extrabold text-white mt-0.5 truncate">{m.val}</p>
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

          {/* Tab Bar: Fully responsive tabs for mobile */}
          <div className="flex gap-1 p-1 sm:p-1.5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(34,197,94,0.1)' }}>
            {[
              {
                id: 'nutrition',
                shortLabel: 'Nutrition',
                fullLabel: 'Nutrition & Traffic Lights',
              },
              {
                id: 'ingredients',
                shortLabel: `Ingredients (${product.ingredients.length})`,
                fullLabel: `Ingredients & Additives (${product.ingredients.length})`,
              },
              {
                id: 'ai',
                shortLabel: '✦ AI Chat',
                fullLabel: '✦ AI Assistant',
                highlight: true,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className="flex-1 py-2 sm:py-2.5 px-2 text-[11px] sm:text-xs font-bold rounded-xl transition-all truncate"
                style={
                  activeTab === tab.id
                    ? {
                        background: tab.highlight ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'rgba(34,197,94,0.14)',
                        color: tab.highlight ? '#fff' : '#86efac',
                        border: '1px solid rgba(34,197,94,0.28)',
                      }
                    : { color: '#9ca3af' }
                }
              >
                <span className="sm:hidden">{tab.shortLabel}</span>
                <span className="hidden sm:inline">{tab.fullLabel}</span>
              </button>
            ))}
          </div>

          {/* ── NUTRITION TAB ── */}
          {activeTab === 'nutrition' && (
            <div className="space-y-4">

              {/* Energy Card */}
              <div className="card p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">Energy Density</h3>
                    <p className="text-[10px] sm:text-[11px] mt-0.5 text-zinc-400">
                      {hasCalories ? 'Per 100g vs 2,000 kcal daily target' : 'Calorie data not reported on Open Food Facts'}
                    </p>
                  </div>
                  <div className="text-right">
                    {hasCalories ? (
                      <>
                        <span className="text-xl sm:text-2xl font-black text-white">{formatNutrient(cleanCalories)}</span>
                        <span className="text-xs font-bold ml-1 text-zinc-400">kcal</span>
                      </>
                    ) : (
                      <span className="text-xs font-bold text-zinc-400 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/10">
                        Not Reported
                      </span>
                    )}
                  </div>
                </div>
                {hasCalories ? (
                  <>
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
                    <p className="text-[10px] sm:text-[11px] mt-2 font-medium text-zinc-400">{caloriePercent}% of 2,000 kcal daily allowance</p>
                  </>
                ) : (
                  <p className="text-[11px] text-zinc-500 italic">No energy values were provided by the community for this barcode.</p>
                )}
              </div>

              {/* Negatives */}
              <div className="card p-4 sm:p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#ef4444', boxShadow: '0 0 6px #ef4444' }} />
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">Negatives · Health Watch</h3>
                    <p className="text-[10px] sm:text-[11px] mt-0.5 text-zinc-400">Nutrients to limit — lower is better</p>
                  </div>
                </div>

                <div className="space-y-3.5 sm:space-y-4">
                  {negatives.map((s) => {
                    const rawVal = s.valuePer100g as any;
                    const cleanNum = typeof rawVal === 'string'
                      ? parseFloat(rawVal.replace(/[^0-9.-]/g, ''))
                      : (rawVal !== null && rawVal !== undefined ? Number(rawVal) : null);
                    const isReported = cleanNum !== null && !isNaN(cleanNum);
                    const isZero = isReported && cleanNum === 0;

                    const dvTarget = DAILY_LIMITS[s.nutrient] || 100;
                    const pct = isReported
                      ? (s.dailyValuePercent !== null && s.dailyValuePercent !== undefined && !isNaN(Number(s.dailyValuePercent)) && Number(s.dailyValuePercent) > 0
                          ? Number(s.dailyValuePercent)
                          : Math.round((cleanNum / dvTarget) * 100))
                      : 0;

                    const widthStyle = isReported && cleanNum > 0
                      ? `${Math.min(100, Math.max(3, pct))}%`
                      : '0%';

                    // Dynamically determine traffic light
                    let traffic = s.trafficLight;
                    const th = NEGATIVE_THRESHOLDS[s.nutrient];
                    if (isReported && th) {
                      if (cleanNum <= th.green) traffic = 'green';
                      else if (cleanNum <= th.amber) traffic = 'amber';
                      else traffic = 'red';
                    }

                    let barColor = 'transparent';
                    let badgeText = 'Not Reported';
                    let badgeStyle = { background: 'rgba(255,255,255,0.04)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.08)' };

                    if (isReported) {
                      if (isZero) {
                        badgeText = 'Zero · Safe 🟢';
                        badgeStyle = { background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' };
                        barColor = 'transparent';
                      } else if (traffic === 'red') {
                        badgeText = 'High · Limit 🔴';
                        badgeStyle = { background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' };
                        barColor = '#ef4444';
                      } else if (traffic === 'amber') {
                        badgeText = 'Moderate 🟡';
                        badgeStyle = { background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' };
                        barColor = '#f59e0b';
                      } else {
                        badgeText = 'Low · Safe 🟢';
                        badgeStyle = { background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' };
                        barColor = '#22c55e';
                      }
                    }

                    return (
                      <div key={s.nutrient}>
                        <div className="flex items-center justify-between text-xs mb-1.5 flex-wrap gap-1">
                          <span className="font-semibold text-white">{s.label}</span>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full" style={badgeStyle}>{badgeText}</span>
                            <span className="text-[10px] sm:text-[11px] font-medium text-zinc-400">
                              {isReported ? `${pct}% DV` : '—'}
                            </span>
                            <span className="font-bold text-white min-w-12 text-right">
                              {isReported ? `${formatNutrient(cleanNum)} ${s.unit}` : '—'}
                            </span>
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
              <div className="card p-4 sm:p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">Positives · Nutritional Benefits</h3>
                    <p className="text-[10px] sm:text-[11px] mt-0.5 text-zinc-400">Beneficial nutrients — higher is better</p>
                  </div>
                </div>

                <div className="space-y-3.5 sm:space-y-4">
                  {positives.map((s) => {
                    const rawVal = s.valuePer100g as any;
                    const cleanNum = typeof rawVal === 'string'
                      ? parseFloat(rawVal.replace(/[^0-9.-]/g, ''))
                      : (rawVal !== null && rawVal !== undefined ? Number(rawVal) : null);
                    const isReported = cleanNum !== null && !isNaN(cleanNum);
                    const val = isReported ? cleanNum : 0;
                    const dvTarget = DAILY_LIMITS[s.nutrient] || 50;
                    const pct = isReported
                      ? (s.dailyValuePercent !== null && s.dailyValuePercent !== undefined && !isNaN(Number(s.dailyValuePercent)) && Number(s.dailyValuePercent) > 0
                          ? Number(s.dailyValuePercent)
                          : Math.round((cleanNum / dvTarget) * 100))
                      : 0;
                    const widthStyle = isReported && val > 0
                      ? `${Math.min(100, Math.max(3, pct))}%`
                      : '0%';

                    let badgeText = 'Not Reported';
                    let badgeStyle = { background: 'rgba(255,255,255,0.04)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.08)' };

                    if (isReported) {
                      badgeText = 'Low Source';
                      if (s.nutrient === 'protein') {
                        if (val >= 10) { badgeText = 'High Protein 🟢'; badgeStyle = { background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }; }
                        else if (val >= 5) { badgeText = 'Good Source 🟢'; badgeStyle = { background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }; }
                      } else if (s.nutrient === 'dietaryFibre') {
                        if (val >= 6) { badgeText = 'High Fibre 🟢'; badgeStyle = { background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }; }
                        else if (val >= 3) { badgeText = 'Good Source 🟢'; badgeStyle = { background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }; }
                      }
                    }

                    return (
                      <div key={s.nutrient}>
                        <div className="flex items-center justify-between text-xs mb-1.5 flex-wrap gap-1">
                          <span className="font-semibold text-white">{s.label}</span>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full" style={badgeStyle}>{badgeText}</span>
                            <span className="text-[10px] sm:text-[11px] font-medium text-zinc-400">
                              {isReported ? `${pct}% of Target` : '—'}
                            </span>
                            <span className="font-bold text-white min-w-12 text-right">
                              {isReported ? `${formatNutrient(val)} ${s.unit}` : '—'}
                            </span>
                          </div>
                        </div>
                        <div className="h-2 rounded-full w-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <div
                            className="h-2 rounded-full transition-all duration-700"
                            style={{ width: widthStyle, background: isReported && val > 0 ? '#22c55e' : 'transparent', boxShadow: isReported && val > 0 ? '0 0 8px rgba(34,197,94,0.5)' : 'none' }}
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

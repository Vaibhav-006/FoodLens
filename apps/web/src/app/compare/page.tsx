'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Scale, Trophy, Plus, ArrowRight, Zap, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

const API = (process.env.NEXT_PUBLIC_API_URL || 'https://foodlens-qg92.onrender.com').replace(/\/+$/, '');

const PRESET_COMPARISONS = [
  {
    title: 'Kurkure vs Lay’s Salted',
    barcodes: ['8901491100519', '8901491001021'],
    tag: 'Classic Snacks',
  },
  {
    title: 'Good Day vs Parle-G',
    barcodes: ['8901063101238', '8901719101037'],
    tag: 'Tea-time Biscuits',
  },
  {
    title: 'Kurkure vs Roasted Makhana',
    barcodes: ['8901491100519', '8906132470014'],
    tag: 'Fried vs Roasted',
  },
];

const NUTRIENT_LABELS: Record<string, { label: string; unit: string; limit: boolean }> = {
  calories: { label: 'Energy / Calories', unit: 'kcal', limit: true },
  totalFat: { label: 'Total Fat', unit: 'g', limit: true },
  saturatedFat: { label: 'Saturated Fat', unit: 'g', limit: true },
  transFat: { label: 'Trans Fat', unit: 'g', limit: true },
  totalSugar: { label: 'Sugar', unit: 'g', limit: true },
  sodium: { label: 'Sodium', unit: 'mg', limit: true },
  protein: { label: 'Protein', unit: 'g', limit: false },
  dietaryFibre: { label: 'Dietary Fibre', unit: 'g', limit: false },
};

function formatNutrient(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  const num = Number(val);
  if (num >= 100) return Math.round(num).toString();
  return Number(num.toFixed(1)).toString();
}

export default function ComparePage() {
  const [barcodes, setBarcodes] = useState(['8901491100519', '8901491001021']);
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addProduct = () => {
    if (barcodes.length < 3) setBarcodes([...barcodes, '']);
  };

  const removeProduct = (idx: number) => {
    if (barcodes.length > 2) {
      setBarcodes(barcodes.filter((_, i) => i !== idx));
    }
  };

  const updateBarcode = (i: number, v: string) => {
    const next = [...barcodes];
    next[i] = v;
    setBarcodes(next);
  };

  const loadPreset = (presetBarcodes: string[]) => {
    setBarcodes(presetBarcodes);
    executeCompare(presetBarcodes);
  };

  const executeCompare = async (targetBarcodes: string[]) => {
    setError(null);
    const valid = targetBarcodes.filter((b) => b.trim().length >= 8);
    if (valid.length < 2) {
      setError('Please provide at least 2 valid 8-14 digit product barcodes');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcodes: valid }),
      });
      const json = await res.json();
      if (json.success) {
        setResult(json.data);
      } else {
        setError(json.error || 'Comparison failed');
      }
    } catch {
      setError('Could not connect to backend server. Make sure port 4000 is active.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-[rgba(34,197,94,0.12)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <Scale className="w-3.5 h-3.5" />
            Nutritional Matrix Duel
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Compare Snacks</h1>
          <p className="text-xs sm:text-sm text-[#4b7a5e] mt-1">
            Compare 2 to 3 packaged foods side-by-side to discover the healthier choice.
          </p>
        </div>

        {/* Quick Presets (Swipeable row on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-nowrap sm:flex-wrap pb-1">
          <span className="text-xs font-semibold text-[#4b7a5e] whitespace-nowrap flex-shrink-0">Popular Duels:</span>
          {PRESET_COMPARISONS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => loadPreset(preset.barcodes)}
              className="text-xs px-3 py-1.5 rounded-xl font-medium bg-white/[0.04] hover:bg-emerald-500/10 text-[#86efac] hover:text-white border border-white/10 hover:border-emerald-500/30 transition-all active:scale-95 whitespace-nowrap flex-shrink-0"
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Input Barcode Cards */}
      <div className="card p-4 sm:p-6 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#86efac]">
          Select Barcodes to Compare
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {barcodes.map((b, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 focus-within:border-emerald-500/40 transition-all"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#4b7a5e]">
                  Product Slot #{i + 1}
                </span>
                {barcodes.length > 2 && (
                  <button
                    onClick={() => removeProduct(i)}
                    className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                value={b}
                onChange={(e) => updateBarcode(i, e.target.value)}
                placeholder="e.g. 8901491100519"
                className="w-full bg-transparent text-base sm:text-sm font-mono text-white placeholder-[#2d5236] focus:outline-none"
                maxLength={14}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          {barcodes.length < 3 && (
            <button
              onClick={addProduct}
              className="btn-secondary w-full sm:w-auto text-xs py-2.5 px-4 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              Add 3rd Product Slot
            </button>
          )}

          <button
            onClick={() => executeCompare(barcodes)}
            disabled={loading}
            className="btn-primary w-full sm:w-auto text-xs py-2.5 px-6 sm:ml-auto disabled:opacity-50 active:scale-95"
          >
            <Zap className="w-4 h-4" />
            {loading ? 'Analyzing Matrix...' : 'Compare Products Now'}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Comparison Results */}
      {result && (
        <div className="card p-4 sm:p-6 space-y-6 sm:space-y-8 animate-fade-up">
          {/* Winner Banner */}
          {result.winner && (
            <div
              className="p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{
                background: 'linear-gradient(135deg, rgba(34,197,94,0.18) 0%, rgba(22,31,24,0.9) 100%)',
                border: '1px solid rgba(34,197,94,0.35)',
                boxShadow: '0 0 30px rgba(34,197,94,0.12)',
              }}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 flex-shrink-0">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    Healthier Recommendation
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-white">
                    {result.products.find((p: any) => p.id === result.winner)?.name} is the superior choice
                  </h3>
                  <p className="text-xs text-[#86efac]/80 mt-0.5">
                    Lower saturated fat / sodium density or superior protein and fibre profile.
                  </p>
                </div>
              </div>

              <Link
                href={`/product/${result.winner}`}
                className="btn-primary w-full sm:w-auto text-xs py-2 px-4 whitespace-nowrap flex-shrink-0 text-center justify-center flex items-center gap-1.5"
              >
                Inspect Winner Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Product Header Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {result.products.map((p: any) => {
              const isWinner = p.id === result.winner;
              const score = result.overallScores[p.id] ?? 50;
              const scoreColor = score >= 60 ? '#22c55e' : score >= 45 ? '#f59e0b' : '#ef4444';

              return (
                <div
                  key={p.id}
                  className="rounded-2xl p-4 sm:p-5 relative transition-all"
                  style={{
                    background: isWinner ? 'rgba(34, 197, 94, 0.08)' : 'rgba(255,255,255,0.02)',
                    border: isWinner ? '1px solid rgba(34, 197, 94, 0.35)' : '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {isWinner && (
                    <span className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white shadow-md shadow-emerald-500/30 flex items-center gap-1">
                      <Trophy className="w-3 h-3" /> WINNER
                    </span>
                  )}

                  <div className="flex items-start justify-between gap-2 mt-1">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#4b7a5e]">
                        {p.brand ?? 'Snack'}
                      </p>
                      <h4 className="text-xs sm:text-sm font-bold text-white mt-0.5 leading-snug line-clamp-2">
                        {p.name}
                      </h4>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xl sm:text-2xl font-black" style={{ color: scoreColor }}>
                        {score}
                      </span>
                      <span className="text-[10px] font-semibold text-[#4b7a5e] block leading-none">
                        / 100
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="text-[#4b7a5e] font-mono text-[10px] sm:text-[11px]">{p.barcode}</span>
                    <Link
                      href={`/product/${p.barcode}`}
                      className="text-emerald-400 font-bold hover:underline inline-flex items-center gap-0.5 text-xs"
                    >
                      View <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Matrix Table with Sticky Nutrient Column */}
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="sticky left-0 bg-[#161f18] z-10 py-3 px-3 text-[11px] font-bold uppercase tracking-wider text-[#4b7a5e] border-r border-white/5 min-w-[130px] sm:min-w-[160px]">
                    Nutrient (Per 100g)
                  </th>
                  {result.products.map((p: any) => (
                    <th
                      key={p.id}
                      className="py-3 px-3 text-center text-xs font-bold text-white min-w-[140px] sm:min-w-[180px] max-w-[200px] truncate"
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {Object.entries(NUTRIENT_LABELS).map(([nutrientKey, meta]) => {
                  return (
                    <tr key={nutrientKey} className="hover:bg-white/[0.02] transition-colors">
                      <td className="sticky left-0 bg-[#161f18] z-10 py-3.5 px-3 border-r border-white/5 min-w-[130px] sm:min-w-[160px]">
                        <span className="font-semibold text-white">{meta.label}</span>
                        <span className="text-[10px] text-[#4b7a5e] block">
                          {meta.limit ? 'Limit intake' : 'Beneficial'}
                        </span>
                      </td>

                      {result.products.map((p: any) => {
                        const scoreItem = result.nutrientScores[p.id]?.find(
                          (s: any) => s.nutrient === nutrientKey
                        );
                        const val = scoreItem?.valuePer100g;
                        const traffic = scoreItem?.trafficLight ?? 'unknown';

                        let badgeStyle = 'bg-white/5 text-[#86efac] border-white/10';
                        if (traffic === 'green') badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                        if (traffic === 'amber') badgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                        if (traffic === 'red') badgeStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/20';

                        return (
                          <td key={p.id} className="py-3.5 px-3 text-center">
                            {val !== undefined && val !== null ? (
                              <span
                                className={`inline-block px-2.5 py-1 rounded-xl text-xs font-bold border ${badgeStyle}`}
                              >
                                {formatNutrient(val)} {meta.unit}
                              </span>
                            ) : (
                              <span className="text-[#2d5236] font-mono">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import type { ParsedIngredient, IngredientProfile } from '@foodlens/core';
import { ChevronDown, ChevronUp, ShieldCheck, AlertTriangle, AlertCircle, Info, Sparkles } from 'lucide-react';

const RISK_BADGE: Record<string, { label: string; badgeStyle: string; icon: any }> = {
  low: {
    label: 'Low Risk',
    badgeStyle: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    icon: ShieldCheck,
  },
  moderate: {
    label: 'Moderate Watch',
    badgeStyle: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    icon: AlertTriangle,
  },
  high: {
    label: 'High Concern',
    badgeStyle: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    icon: AlertCircle,
  },
  unknown: {
    label: 'General Component',
    badgeStyle: 'bg-white/5 text-[#86efac] border-white/10',
    icon: Info,
  },
};

const CATEGORY_LABEL: Record<string, string> = {
  preservative: '🧪 Preservative',
  emulsifier: '💧 Emulsifier',
  flavour_enhancer: '🧂 Flavour Enhancer',
  colouring: '🎨 Colouring',
  sweetener: '🍬 Sweetener',
  antioxidant: '🛡️ Antioxidant',
  stabiliser: '⚖️ Stabiliser',
  thickener: '🥣 Thickener',
  nutrient: '💊 Nutrient',
  natural: '🌿 Natural Ingredient',
  unknown: '📦 Food Component',
};

function IngredientCard({ ing, defaultOpen = false }: { ing: ParsedIngredient; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const p = ing.profile as IngredientProfile | undefined;
  const riskMeta = p ? (RISK_BADGE[p.riskLevel] ?? RISK_BADGE.unknown) : RISK_BADGE.unknown;
  const RiskIcon = riskMeta.icon;

  const displayName = p?.name ?? ing.name ?? ing.originalText;
  const showOriginal = ing.originalText && ing.originalText.toLowerCase() !== displayName.toLowerCase();

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        background: 'rgba(22, 31, 24, 0.7)',
        border: open ? '1px solid rgba(34, 197, 94, 0.28)' : '1px solid rgba(34, 197, 94, 0.12)',
        boxShadow: open ? '0 0 24px rgba(34, 197, 94, 0.08)' : 'none',
      }}
    >
      <button
        type="button"
        className="w-full flex items-center justify-between px-3.5 py-3 sm:px-4 sm:py-3.5 text-left transition-colors hover:bg-white/[0.02] gap-2"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1 pr-1">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-white leading-snug">
                {displayName}
              </span>
              {ing.eNumber && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  {ing.eNumber}
                </span>
              )}
            </div>
            {showOriginal && (
              <p className="text-[10px] sm:text-[11px] mt-0.5 truncate font-normal text-[#4b7a5e]">
                Label on pack: &ldquo;{ing.originalText}&rdquo;
              </p>
            )}
          </div>

          {p && (
            <span
              className={`text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border flex items-center gap-1 sm:gap-1.5 flex-shrink-0 ${riskMeta.badgeStyle}`}
            >
              <RiskIcon className="w-3 h-3" />
              <span>{riskMeta.label}</span>
            </span>
          )}
        </div>

        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center text-[#86efac] flex-shrink-0 transition-transform"
          style={{ background: 'rgba(34, 197, 94, 0.08)' }}
        >
          {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {open && p && (
        <div
          className="px-3.5 py-3 sm:px-5 sm:py-4 space-y-3 sm:space-y-4 text-xs"
          style={{
            background: 'rgba(10, 15, 13, 0.5)',
            borderTop: '1px solid rgba(34, 197, 94, 0.1)',
          }}
        >
          {/* Category & Evidence badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-white/[0.04] text-[#86efac] border border-white/10">
              {CATEGORY_LABEL[p.category] ?? p.category}
            </span>
            {p.evidenceGrade && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-white/[0.04] text-[#86efac] border border-white/10">
                Evidence Grade: <strong className="text-emerald-400">{p.evidenceGrade}</strong>
              </span>
            )}
            {p.adiMgPerKg && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20">
                ADI: {p.adiMgPerKg} mg/kg bw
              </span>
            )}
          </div>

          {/* What is it */}
          {p.whatIsIt && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#4b7a5e]">What is it?</p>
              <p className="text-xs text-[#dcfce7]/90 mt-1 leading-relaxed">{p.whatIsIt}</p>
            </div>
          )}

          {/* Purpose & Why used */}
          {(p.whyUsed || p.purpose) && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#4b7a5e]">Why is it used in snacks?</p>
              <p className="text-xs text-[#dcfce7]/90 mt-1 leading-relaxed">
                {p.whyUsed || p.purpose}
              </p>
            </div>
          )}

          {/* Benefits */}
          {p.benefits && p.benefits.length > 0 && (
            <div className="rounded-xl p-3 bg-emerald-500/[0.07] border border-emerald-500/20">
              <p className="text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Known Functional Benefits
              </p>
              <ul className="mt-1.5 space-y-1">
                {p.benefits.map((b, i) => (
                  <li key={i} className="text-xs text-emerald-200/90 flex items-start gap-2 leading-relaxed">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Health Concerns */}
          {p.concerns && p.concerns.length > 0 && (
            <div className="rounded-xl p-3 bg-rose-500/[0.07] border border-rose-500/20">
              <p className="text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 text-rose-400">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Potential Health Concerns & Warnings
              </p>
              <ul className="mt-1.5 space-y-1">
                {p.concerns.map((c, i) => (
                  <li key={i} className="text-xs text-rose-200/90 flex items-start gap-2 leading-relaxed">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Regulatory Standards */}
          {(p.fssaiStatus || p.fdaStatus || p.efsaStatus) && (
            <div className="pt-2 border-t border-white/[0.06]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#4b7a5e] mb-2">
                Regulatory Standards & Approvals
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {p.fssaiStatus && (
                  <div className="rounded-xl p-2.5 bg-white/[0.03] border border-white/[0.07]">
                    <span className="text-[9px] font-black uppercase tracking-wider block text-emerald-400">
                      FSSAI (India)
                    </span>
                    <p className="text-[11px] text-[#f0fdf4] font-medium mt-1 leading-tight">{p.fssaiStatus}</p>
                  </div>
                )}
                {p.fdaStatus && (
                  <div className="rounded-xl p-2.5 bg-white/[0.03] border border-white/[0.07]">
                    <span className="text-[9px] font-black uppercase tracking-wider block text-[#86efac]">
                      US FDA
                    </span>
                    <p className="text-[11px] text-[#f0fdf4] font-medium mt-1 leading-tight">{p.fdaStatus}</p>
                  </div>
                )}
                {p.efsaStatus && (
                  <div className="rounded-xl p-2.5 bg-white/[0.03] border border-white/[0.07]">
                    <span className="text-[9px] font-black uppercase tracking-wider block text-[#86efac]">
                      EFSA (Europe)
                    </span>
                    <p className="text-[11px] text-[#f0fdf4] font-medium mt-1 leading-tight">{p.efsaStatus}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function IngredientsList({ ingredients }: { ingredients: ParsedIngredient[] }) {
  if (!ingredients.length) {
    return (
      <div className="text-center py-10 px-4 space-y-3">
        <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center bg-white/[0.04] text-zinc-400 border border-white/10 text-xl">
          📦
        </div>
        <h3 className="text-sm font-bold text-white">No Ingredients Uploaded Yet</h3>
        <p className="text-xs text-[#86efac]/70 max-w-sm mx-auto leading-relaxed">
          Open Food Facts contributors registered this barcode and name, but haven&apos;t typed the ingredients label yet.
        </p>
        <p className="text-xs text-emerald-400 font-semibold pt-1">
          💡 Tip: Click the <strong className="text-white">✦ AI Chat</strong> tab above to ask about typical ingredients for this snack!
        </p>
      </div>
    );
  }

  const withRisk = ingredients.filter(
    (i) => (i.profile as IngredientProfile)?.riskLevel === 'high' || (i.profile as IngredientProfile)?.riskLevel === 'moderate'
  );

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[rgba(34,197,94,0.12)]">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white leading-none">
              Ingredient Intelligence Engine ({ingredients.length})
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs text-[#4b7a5e] mt-1.5">
            Decoded additive E-numbers, functional categories, and FSSAI health assessments
          </p>
        </div>

        {withRisk.length > 0 && (
          <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 self-start sm:self-auto flex-shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>{withRisk.length} to watch</span>
          </span>
        )}
      </div>

      {/* Accordion list */}
      <div className="space-y-2.5">
        {ingredients.map((ing, i) => (
          <IngredientCard key={i} ing={ing} defaultOpen={i === 0 || i === 1} />
        ))}
      </div>
    </div>
  );
}

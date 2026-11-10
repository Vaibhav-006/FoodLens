'use client';

import { ScanLine, ShieldCheck, Activity, Sparkles } from 'lucide-react';

interface ScanLoadingOverlayProps {
  barcode?: string | null;
  productName?: string | null;
  fullscreen?: boolean;
}

export function ScanLoadingOverlay({
  barcode,
  productName,
  fullscreen = true,
}: ScanLoadingOverlayProps) {
  const content = (
    <div
      className="w-full max-w-sm sm:max-w-md rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center relative overflow-hidden border transform-gpu"
      style={{
        background: 'linear-gradient(170deg, #0e1b11 0%, #070e09 100%)',
        borderColor: 'rgba(34, 197, 94, 0.28)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), 0 0 40px rgba(34, 197, 94, 0.1)',
      }}
    >
      {/* Top Engine Pill */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-5">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
          FoodLens Radar
        </span>
      </div>

      {/* Lightweight 60fps Scanner Reticle Box */}
      <div
        className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center mb-5 overflow-hidden border bg-black/60"
        style={{
          borderColor: 'rgba(34, 197, 94, 0.25)',
        }}
      >
        {/* Reticle corner brackets */}
        <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-emerald-400 rounded-tl pointer-events-none" />
        <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-emerald-400 rounded-tr pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-emerald-400 rounded-bl pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-emerald-400 rounded-br pointer-events-none" />

        {/* Smooth GPU Laser Line */}
        <div className="absolute left-2 right-2 top-2 h-0.5 bg-[#4ade80] shadow-[0_0_8px_#22c55e] animate-laser-sweep pointer-events-none z-10" />

        {/* Center Scanner Icon */}
        <div className="relative z-0 p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
          <ScanLine className="w-10 h-10 stroke-[1.5]" />
        </div>
      </div>

      {/* Title & Product Info */}
      <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
        {productName ? `Analyzing ${productName}` : 'Analyzing Barcode...'}
      </h3>

      {barcode && (
        <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/[0.05] border border-white/10 font-mono text-[11px] text-emerald-300">
          <span className="text-zinc-400 font-sans">CODE:</span>
          <span className="font-bold">{barcode}</span>
        </div>
      )}

      {/* GPU Accelerated Shimmer Progress Bar */}
      <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden my-4 relative transform-gpu">
        <div
          className="absolute inset-y-0 w-1/2 rounded-full animate-shimmer-gpu"
          style={{
            background: 'linear-gradient(90deg, transparent, #22c55e, #86efac, transparent)',
          }}
        />
      </div>

      {/* Simple, Non-lagging Pipeline Steps */}
      <div className="w-full space-y-2 text-left bg-black/30 border border-white/5 rounded-2xl p-3">
        <div className="flex items-center gap-2.5 text-xs text-zinc-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span className="truncate">Matching verified Indian food database</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-zinc-300">
          <Activity className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span className="truncate">Evaluating nutrition & health safety score</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-zinc-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span className="truncate">Checking additives, INS codes & allergens</span>
        </div>
      </div>
    </div>
  );

  if (!fullscreen) {
    return content;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050806]/95 transform-gpu"
    >
      {content}
    </div>
  );
}

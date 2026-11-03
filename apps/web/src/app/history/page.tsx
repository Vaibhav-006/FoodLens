'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { History, Trash2, ArrowRight, Scan, Sparkles } from 'lucide-react';

interface HistoryItem {
  barcode: string;
  name: string;
  brand?: string;
  score?: number;
  scannedAt: string;
}

const DEMO_ITEMS: HistoryItem[] = [
  { barcode: '8901491100519', name: 'Kurkure Masala Munch', brand: 'PepsiCo India', score: 45, scannedAt: '2 hours ago' },
  { barcode: '8901491001021', name: "Lay's Classic Salted Potato Chips", brand: "Lay's", score: 63, scannedAt: 'Yesterday' },
  { barcode: '044000030148', name: 'Oreo Chocolate Sandwich Cookies', brand: 'Mondelez', score: 38, scannedAt: '2 days ago' },
  { barcode: '8901058511875', name: 'Maggi 2-Minute Noodles Masala', brand: 'Nestlé India', score: 42, scannedAt: '3 days ago' },
];

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('foodlens_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      } else {
        setHistory(DEMO_ITEMS);
      }
    } catch {
      setHistory(DEMO_ITEMS);
    }
  }, []);

  const clearHistory = () => {
    try {
      localStorage.removeItem('foodlens_history');
    } catch {}
    setHistory([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(34,197,94,0.12)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <History className="w-3.5 h-3.5" />
            Inspection Log
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Scan History</h1>
          <p className="text-xs sm:text-sm text-[#4b7a5e] mt-1">
            Review your previously decoded snacks, chips, and pantry items.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Log
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="card text-center py-16 px-6 space-y-4">
          <div className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
            <Scan className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">No Scan Records Yet</h2>
            <p className="text-xs text-[#4b7a5e] mt-1 max-w-sm mx-auto leading-relaxed">
              Use the live camera or upload a package photo to analyze food products and add them to your history.
            </p>
          </div>
          <Link href="/scan" className="btn-primary inline-flex text-xs px-5 py-2.5 mt-2">
            <Scan className="w-4 h-4" />
            Launch Scanner
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {history.map((item) => {
            const score = item.score ?? 50;
            const isGood = score >= 60;
            const isOk = score >= 45 && score < 60;
            const scoreColor = isGood ? '#22c55e' : isOk ? '#f59e0b' : '#ef4444';
            const scoreLabel = isGood ? 'Good' : isOk ? 'Moderate' : 'Poor';

            return (
              <Link
                key={item.barcode}
                href={`/product/${item.barcode}`}
                className="card card-hover p-4 flex items-center justify-between gap-4 group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#4b7a5e]">
                      {item.brand ?? 'Packaged Food'}
                    </span>
                    <span className="text-[10px] text-[#2d5236]">•</span>
                    <span className="text-[10px] text-[#4b7a5e]">{item.scannedAt}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                    {item.name}
                  </h3>

                  <p className="text-[11px] font-mono text-[#4b7a5e] mt-1">
                    {item.barcode}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div
                    className="text-center px-3 py-1.5 rounded-xl border flex flex-col items-center"
                    style={{
                      background: `${scoreColor}14`,
                      borderColor: `${scoreColor}30`,
                    }}
                  >
                    <span className="text-base font-black leading-none" style={{ color: scoreColor }}>
                      {score}
                    </span>
                    <span className="text-[8px] font-bold uppercase mt-0.5" style={{ color: scoreColor }}>
                      {scoreLabel}
                    </span>
                  </div>

                  <ArrowRight className="w-4 h-4 text-[#2d5236] group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

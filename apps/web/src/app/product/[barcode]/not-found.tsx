'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const POPULAR_SNACKS = [
  { name: 'Kurkure Masala Munch', code: '8901491100519', icon: '🌶️' },
  { name: "Lay's Magic Masala", code: '8901491101837', icon: '🥔' },
  { name: "Lay's Classic Salted", code: '028400064057', icon: '🧂' },
  { name: 'Oreo Vanilla Cookies', code: '044000030148', icon: '🍪' },
  { name: 'Maggi 2-Min Noodles', code: '8901058511875', icon: '🍜' },
  { name: 'Parle-G Gluco Biscuits', code: '8901719101037', icon: '☕' },
  { name: 'Britannia Good Day', code: '8901063101238', icon: '🧈' },
  { name: "Haldiram's Aloo Bhujia", code: '8904063200021', icon: '🥣' },
  { name: 'Cadbury Dairy Milk', code: '7622210817020', icon: '🍫' },
];

export default function ProductNotFound() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    // Redirect to home with search query
    router.push(`/?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="max-w-xl mx-auto py-6 sm:py-10 px-2 sm:px-4">
      <div className="card text-center p-5 sm:p-8 space-y-6">
        <div className="text-5xl">🔍</div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white mb-2">Barcode Not In Database</h1>
          <p className="text-xs sm:text-sm text-[#86efac]/80 max-w-md mx-auto leading-relaxed">
            This exact barcode wasn&apos;t catalogued in Open Food Facts yet. Try searching by snack name or pick from popular snacks below.
          </p>
        </div>

        {/* Quick Search */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search snack (e.g. Kurkure, Oreo)..."
            className="flex-1 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-[#2d5236] bg-white/[0.04] border border-white/10 focus:outline-none focus:border-emerald-500/50"
          />
          <button type="submit" className="btn-primary text-xs sm:text-sm px-4 py-2.5 active:scale-95">
            Search
          </button>
        </form>

        <div className="border-t border-white/[0.08] pt-6">
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#4b7a5e] mb-3">
            Or view verified snacks:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-left">
            {POPULAR_SNACKS.map((s) => (
              <Link
                key={s.code}
                href={`/product/${s.code}`}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-white/[0.06] hover:border-emerald-500/40 bg-white/[0.02] hover:bg-emerald-500/10 transition-all text-xs font-medium text-white active:scale-95"
              >
                <span className="text-sm">{s.icon}</span>
                <span className="truncate">{s.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Link href="/scan" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4b7a5e] hover:text-emerald-400 transition-colors">
            ← Return to Barcode Scanner
          </Link>
        </div>
      </div>
    </div>
  );
}

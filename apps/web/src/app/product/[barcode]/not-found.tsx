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
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="card text-center py-8">
        <div className="text-5xl mb-3">🔍</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Barcode Not In Database</h1>
        <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
          This exact barcode wasn't catalogued in Open Food Facts yet. Try searching by snack name or pick from popular snacks below.
        </p>

        {/* Quick Search */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by snack name (e.g. Kurkure, Oreo)..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button type="submit" className="btn-primary text-sm px-4 py-2.5">
            Search
          </button>
        </form>

        <div className="border-t border-gray-100 pt-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Or view verified snacks:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-left">
            {POPULAR_SNACKS.map((s) => (
              <Link
                key={s.code}
                href={`/product/${s.code}`}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-100 hover:border-brand-300 hover:bg-brand-50/50 transition-all text-xs font-medium text-gray-700"
              >
                <span>{s.icon}</span>
                <span className="truncate">{s.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <Link href="/" className="text-xs text-gray-400 hover:text-brand-600 transition-colors">
            ← Return to Barcode Scanner
          </Link>
        </div>
      </div>
    </div>
  );
}

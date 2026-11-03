'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ProductResult {
  id: string;
  barcode: string;
  name: string;
  brand: string | null;
  nutriscore?: string | null;
}

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export function SearchByName() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ProductResult[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(`${API}/api/product/search?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (json.success) {
        setResults(json.data);
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <form onSubmit={handleSearch} className="flex flex-col gap-3">
        <label className="block text-sm font-semibold text-gray-700">
          Search Snack or Brand Name
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Kurkure, Lay's Masala, Oreo, Parle-G..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="btn-primary disabled:opacity-50 text-sm px-5"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Popular searches suggestions */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-xs text-gray-400">Try:</span>
          {['Kurkure', "Lay's", 'Oreo', 'Maggi', 'Good Day', 'Parle-G', 'Haldiram'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                setQuery(tag);
              }}
              className="text-xs bg-gray-100 hover:bg-brand-50 hover:text-brand-700 px-2.5 py-1 rounded-lg transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </form>

      {/* Results */}
      {searched && (
        <div className="mt-5 border-t border-gray-100 pt-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">
            {results.length > 0 ? `Found ${results.length} snack(s):` : 'No matching snacks found. Try a different keyword.'}
          </p>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {results.map((p) => (
              <Link
                key={p.barcode}
                href={`/product/${p.barcode}`}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-brand-300 hover:bg-brand-50/40 transition-all group"
              >
                <div className="min-w-0 pr-3">
                  <p className="text-sm font-bold text-gray-800 group-hover:text-brand-600 truncate transition-colors">
                    {p.name}
                  </p>
                  <p className="text-xs text-gray-500">{p.brand ?? 'Packaged Food'} · {p.barcode}</p>
                </div>
                <span className="text-xs bg-brand-50 text-brand-700 font-semibold px-2.5 py-1 rounded-lg flex-shrink-0 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  View →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


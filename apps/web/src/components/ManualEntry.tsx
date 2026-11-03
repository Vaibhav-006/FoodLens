'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const DEMO_SNACKS = [
  { label: 'Kurkure Masala', code: '8901491100519', icon: '🌶️' },
  { label: "Lay's Magic Masala", code: '8901491101837', icon: '🥔' },
  { label: "Lay's Classic", code: '028400064057', icon: '🧂' },
  { label: 'Oreo Cookies', code: '044000030148', icon: '🍪' },
  { label: 'Maggi Noodles', code: '8901058511875', icon: '🍜' },
  { label: 'Parle-G Biscuits', code: '8901719101037', icon: '☕' },
  { label: 'Good Day Butter', code: '8901063101238', icon: '🧈' },
  { label: "Haldiram's Bhujia", code: '8904063200021', icon: '🥣' },
  { label: 'Cadbury Dairy Milk', code: '7622210817020', icon: '🍫' },
  { label: 'Bingo Mad Angles', code: '8901725131035', icon: '📐' },
];

export function ManualEntry() {
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = barcode.trim().replace(/\s/g, '');
    if (cleaned.length < 8) return;
    setLoading(true);
    router.push(`/product/${cleaned}`);
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Barcode Number
          </label>
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="e.g. 8901491100519 (Kurkure)"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            maxLength={14}
            pattern="[0-9]+"
            inputMode="numeric"
          />
          <p className="text-xs text-gray-400 mt-1">
            Find the 8 to 14 digit barcode printed on the back of any snack packet.
          </p>
        </div>

        {/* Demo products */}
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">Or select a verified snack:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DEMO_SNACKS.map((p) => (
              <button
                key={p.code}
                type="button"
                onClick={() => setBarcode(p.code)}
                className={`text-xs p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                  barcode === p.code
                    ? 'border-brand-500 bg-brand-50 text-brand-800 font-bold'
                    : 'border-gray-100 bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span>{p.icon}</span>
                <span className="truncate">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={barcode.length < 8 || loading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading ? '🔍 Looking up...' : '🔍 Analyse Product'}
        </button>
      </form>
    </div>
  );
}

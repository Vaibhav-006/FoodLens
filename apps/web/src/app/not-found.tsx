import Link from 'next/link';
import { Search, Scan, ArrowLeft, Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  { name: 'Kurkure Masala Munch', code: '8901491100519', icon: '🌶️' },
  { name: "Lay's Classic Salted", code: '8901491001021', icon: '🥔' },
  { name: 'Oreo Sandwich Cookies', code: '044000030148', icon: '🍪' },
  { name: 'Maggi 2-Minute Noodles', code: '8901058511875', icon: '🍜' },
];

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto py-16 text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
        <Search className="w-8 h-8" />
      </div>

      <div>
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
          Product Not Indexed Yet
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
          Snack or Barcode Not Found
        </h1>
        <p className="text-xs sm:text-sm text-[#4b7a5e] mt-2 max-w-md mx-auto leading-relaxed">
          This barcode is not yet in the local catalog. You can try searching by brand name, scan another product, or explore one of these popular verified snacks:
        </p>
      </div>

      {/* Verified Snack Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-left">
        {SUGGESTIONS.map((s) => (
          <Link
            key={s.code}
            href={`/product/${s.code}`}
            className="card card-hover p-3 flex items-center gap-3 group"
          >
            <span className="text-2xl">{s.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                {s.name}
              </p>
              <p className="text-[10px] font-mono text-[#4b7a5e]">{s.code}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="pt-4 flex items-center justify-center gap-3">
        <Link href="/" className="btn-secondary text-xs px-4 py-2.5">
          <ArrowLeft className="w-3.5 h-3.5" /> Back Home
        </Link>
        <Link href="/scan" className="btn-primary text-xs px-5 py-2.5">
          <Scan className="w-3.5 h-3.5" /> Open Scanner
        </Link>
      </div>
    </div>
  );
}


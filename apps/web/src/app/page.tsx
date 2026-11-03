'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Scan, Zap, ChevronRight, Scale, Activity, Shield, Brain } from 'lucide-react';
import { ProductImage } from '@/components/ProductImage';

const POPULAR_CHIPS = [
  { label: 'Kurkure', code: '8901491100519', icon: '🌶️' },
  { label: "Lay's Classic", code: '8901491001021', icon: '🥔' },
  { label: "Lay's Magic Masala", code: '8901491101837', icon: '✨' },
  { label: 'Oreo', code: '044000030148', icon: '🍪' },
  { label: 'Maggi', code: '8901058511875', icon: '🍜' },
  { label: 'Parle-G', code: '8901719101037', icon: '🟡' },
  { label: 'Good Day', code: '8901063101238', icon: '☀️' },
];

const RECOMMENDED_SNACKS = [
  {
    barcode: '8901491001021',
    name: "Lay's Classic Salted",
    brand: "Lay's",
    score: 63,
    scoreLabel: 'Moderate',
    cal: '536 kcal',
    protein: '7.1g',
    fat: '35.7g',
    image: 'https://images.openfoodfacts.org/images/products/890/149/100/1021/front_en.3.400.jpg',
    fallbackIcon: '🥔',
  },
  {
    barcode: '8901063101238',
    name: 'Good Day Butter Cookies',
    brand: 'Britannia',
    score: 55,
    scoreLabel: 'Moderate',
    cal: '492 kcal',
    protein: '7.0g',
    fat: '21.0g',
    image: 'https://images.openfoodfacts.org/images/products/890/106/309/3522/front_en.28.400.jpg',
    fallbackIcon: '🍪',
  },
  {
    barcode: '8904063200021',
    name: "Haldiram's Bhujia Sev",
    brand: 'Haldiram',
    score: 68,
    scoreLabel: 'Good',
    cal: '554 kcal',
    protein: '7.2g',
    fat: '35.0g',
    image: 'https://images.openfoodfacts.org/images/products/890/406/320/0021/front_en.3.400.jpg',
    fallbackIcon: '🫙',
  },
];

const RECENT_SCANS = [
  {
    barcode: '8901491100519',
    name: 'Kurkure Masala Munch',
    brand: 'Kurkure (PepsiCo)',
    time: '2 hrs ago',
    score: 45,
    cal: '558 kcal',
    sugar: '2.1g',
    sodium: '890mg',
    image: 'https://images.openfoodfacts.org/images/products/890/149/110/0519/front_en.48.400.jpg',
    fallbackIcon: '🌶️',
  },
  {
    barcode: '044000030148',
    name: 'Oreo Chocolate Cookies',
    brand: 'Oreo (Mondelez)',
    time: 'Yesterday',
    score: 38,
    cal: '483 kcal',
    sugar: '38.5g',
    sodium: '460mg',
    image: 'https://images.openfoodfacts.org/images/products/762/230/033/6738/front_en.407.400.jpg',
    fallbackIcon: '🍪',
  },
  {
    barcode: '8901058511875',
    name: 'Maggi 2-Minute Noodles',
    brand: 'Maggi (Nestlé)',
    time: '2 days ago',
    score: 42,
    cal: '427 kcal',
    sugar: '2.2g',
    sodium: '1230mg',
    image: 'https://images.openfoodfacts.org/images/products/890/105/885/1328/front_en.17.400.jpg',
    fallbackIcon: '🍜',
  },
  {
    barcode: '8901719101037',
    name: 'Parle-G Gluco Biscuits',
    brand: 'Parle',
    time: '3 days ago',
    score: 52,
    cal: '454 kcal',
    sugar: '25.5g',
    sodium: '290mg',
    image: 'https://images.openfoodfacts.org/images/products/890/171/913/4845/front_en.11.400.jpg',
    fallbackIcon: '🟡',
  },
];

const FEATURES = [
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Additive Intelligence',
    desc: 'Identifies E-numbers, preservatives & FSSAI status instantly',
    color: 'from-emerald-500/20 to-emerald-500/5',
    accent: '#22c55e',
  },
  {
    icon: <Activity className="w-5 h-5" />,
    title: 'Traffic-Light Nutrition',
    desc: 'WHO & FSSAI benchmarked daily value % per 100g',
    color: 'from-sky-500/20 to-sky-500/5',
    accent: '#38bdf8',
  },
  {
    icon: <Scale className="w-5 h-5" />,
    title: 'Side-by-Side Compare',
    desc: 'Compare 2–3 snacks to pick the healthiest choice',
    color: 'from-violet-500/20 to-violet-500/5',
    accent: '#a78bfa',
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: 'AI Food Assistant',
    desc: 'Ask about diabetes, child safety, or get answers in Hindi',
    color: 'from-amber-500/20 to-amber-500/5',
    accent: '#fbbf24',
  },
];

function ScoreRing({ score }: { score: number }) {
  const isGood = score >= 60;
  const isOk = score >= 45 && score < 60;
  const color = isGood ? '#22c55e' : isOk ? '#f59e0b' : '#ef4444';
  const label = isGood ? 'Good' : isOk ? 'Ok' : 'Poor';
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-14 h-14 flex-shrink-0">
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <circle
          cx="28" cy="28" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-black text-white leading-none">{score}</span>
        <span className="text-[8px] font-bold leading-none" style={{ color }}>{label}</span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = query.trim();
    if (!cleaned) return;
    if (/^\d{8,14}$/.test(cleaned)) {
      router.push(`/product/${cleaned}`);
    } else {
      router.push(`/scan?search=${encodeURIComponent(cleaned)}`);
    }
  };

  return (
    <div className="space-y-8">

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative rounded-3xl overflow-hidden dot-grid" style={{ background: 'linear-gradient(135deg, #0d1f11 0%, #0a150d 60%, #0f1a10 100%)' }}>
        {/* Glow orbs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)' }} />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)' }} />

        <div className="relative z-10 px-8 py-12 sm:px-12 sm:py-16 flex flex-col items-center text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-bold" style={{ background: 'rgba(34,197,94,0.12)', color: '#86efac', border: '1px solid rgba(34,197,94,0.25)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            FSSAI · WHO · EFSA Evidence-Based Analysis
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-3xl leading-[1.1] text-white">
            Know Exactly<br />
            <span className="text-gradient-green">What You Eat</span>
          </h1>

          <p className="text-sm sm:text-base mt-5 max-w-xl leading-relaxed" style={{ color: '#86efac', opacity: 0.8 }}>
            Scan any Indian packed food barcode — chips, biscuits, noodles, namkeen — and instantly decode ingredients, additives, and nutrition risk.
          </p>

          {/* Search bar */}
          <div className="w-full max-w-2xl mt-10">
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2 rounded-2xl p-2 transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(34,197,94,0.2)', backdropFilter: 'blur(10px)' }}
            >
              <div className="pl-2 text-[#4b7a5e]">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Barcode or snack name (e.g. Kurkure, Lay's, 8901491001021)..."
                className="flex-1 bg-transparent py-2.5 px-2 text-sm text-white placeholder-[#4b7a5e] focus:outline-none"
              />
              <button type="submit" className="btn-primary text-sm px-5 py-2.5">
                <Zap className="w-4 h-4" />
                Analyze
              </button>
              <Link
                href="/scan"
                className="btn-secondary text-sm px-4 py-2.5"
                title="Open Camera Scanner"
              >
                <Scan className="w-4 h-4" />
                <span className="hidden sm:inline">Camera</span>
              </Link>
            </form>

            {/* Quick chip tags */}
            <div className="flex items-center justify-center gap-2 flex-wrap mt-4">
              <span className="text-xs font-medium" style={{ color: '#4b7a5e' }}>Try:</span>
              {POPULAR_CHIPS.slice(0, 7).map((p) => (
                <Link
                  key={p.code}
                  href={`/product/${p.code}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all"
                  style={{ background: 'rgba(34,197,94,0.08)', color: '#86efac', border: '1px solid rgba(34,197,94,0.15)' }}
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-8 mt-10 pt-8" style={{ borderTop: '1px solid rgba(34,197,94,0.1)' }}>
            {[
              { value: '16+', label: 'Indian Products' },
              { value: '50+', label: 'Additives Mapped' },
              { value: '12', label: 'AI Intent Categories' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-black text-gradient-green">{s.value}</div>
                <div className="text-[11px] font-medium mt-0.5" style={{ color: '#4b7a5e' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── RECOMMENDED SNACKS ─────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Recommended Snacks</h2>
            <p className="text-xs mt-0.5" style={{ color: '#4b7a5e' }}>Verified snacks with balanced nutrition</p>
          </div>
          <Link href="/scan" className="text-xs font-semibold flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all" style={{ color: '#86efac', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
            Compare Snacks <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {RECOMMENDED_SNACKS.map((snack) => {
            const isGood = snack.score >= 60;
            const isOk = snack.score >= 45 && snack.score < 60;
            const scoreColor = isGood ? '#22c55e' : isOk ? '#f59e0b' : '#ef4444';
            return (
              <Link
                key={snack.barcode}
                href={`/product/${snack.barcode}`}
                className="card card-hover p-5 flex flex-col gap-4 group"
              >
                {/* Product image area */}
                <div className="w-full h-28 rounded-xl flex items-center justify-center overflow-hidden" style={{ background: 'rgba(34,197,94,0.04)' }}>
                  <ProductImage
                    src={snack.image}
                    alt={snack.name}
                    fallbackIcon={snack.fallbackIcon}
                    className="h-24 w-auto object-contain"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#4b7a5e' }}>{snack.brand}</p>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#86efac] transition-colors leading-snug">{snack.name}</h3>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex gap-2">
                    <span className="text-[11px] px-2 py-0.5 rounded-md font-medium" style={{ background: 'rgba(255,255,255,0.05)', color: '#86efac' }}>{snack.cal}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md font-medium" style={{ background: 'rgba(255,255,255,0.05)', color: '#86efac' }}>Prot: {snack.protein}</span>
                  </div>
                  <div className="text-xs font-black" style={{ color: scoreColor }}>
                    {snack.score}<span className="text-[9px] font-semibold opacity-60">/100</span>
                  </div>
                </div>

                {/* Score bar */}
                <div className="h-1 rounded-full w-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div
                    className="h-1 rounded-full transition-all"
                    style={{ width: `${snack.score}%`, background: scoreColor, boxShadow: `0 0 8px ${scoreColor}` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── RECENT SCANS ───────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Recent Scans</h2>
            <p className="text-xs mt-0.5" style={{ color: '#4b7a5e' }}>Recently analyzed chips, noodles, and biscuits</p>
          </div>
          <Link href="/history" className="text-xs font-semibold flex items-center gap-1" style={{ color: '#4b7a5e' }}>
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {RECENT_SCANS.map((item) => (
            <Link
              key={item.barcode}
              href={`/product/${item.barcode}`}
              className="card card-hover p-4 flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.1)' }}>
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    fallbackIcon={item.fallbackIcon}
                    className="w-full h-full object-contain p-1"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white truncate group-hover:text-[#86efac] transition-colors">{item.name}</h3>
                  <p className="text-[11px] mt-0.5" style={{ color: '#4b7a5e' }}>{item.brand} · {item.time}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-medium" style={{ background: 'rgba(255,255,255,0.05)', color: '#86efac' }}>{item.cal}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-medium" style={{ background: 'rgba(255,255,255,0.05)', color: '#86efac' }}>Sugar: {item.sugar}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-medium" style={{ background: 'rgba(255,255,255,0.05)', color: '#86efac' }}>Na: {item.sodium}</span>
                  </div>
                </div>
              </div>

              <ScoreRing score={item.score} />
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FEATURE PILLARS ────────────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pb-4">
        {FEATURES.map((f, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 transition-all glass-card border border-white/10 hover:border-emerald-500/30 hover:bg-white/[0.04] flex flex-col justify-between group"
            style={{
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            <div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3.5 border transition-transform group-hover:scale-105"
                style={{
                  background: `${f.accent}20`,
                  color: f.accent,
                  borderColor: `${f.accent}40`,
                }}
              >
                {f.icon}
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight">{f.title}</h4>
              <p className="text-xs mt-2 text-zinc-300 font-medium leading-relaxed">
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Scan,
  Scale,
  ShieldCheck,
  AlertTriangle,
  Heart,
  TrendingUp,
  Activity,
  ArrowRight,
  LogOut,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  PieChart,
} from 'lucide-react';

interface ScannedItem {
  barcode: string;
  name: string;
  brand?: string;
  score?: number;
  scannedAt: string;
}

const DEFAULT_HISTORY: ScannedItem[] = [
  { barcode: '8901491100519', name: 'Kurkure Masala Munch', brand: 'PepsiCo India', score: 45, scannedAt: 'Today, 2:30 PM' },
  { barcode: '8901491366052', name: 'Kurkure Puffcorn Yummy Cheese', brand: 'PepsiCo India', score: 17, scannedAt: 'Yesterday' },
  { barcode: '8901491001021', name: "Lay's Classic Salted Chips", brand: "Lay's", score: 63, scannedAt: '3 days ago' },
  { barcode: '8906132470014', name: 'Farmley Roasted Makhana', brand: 'Farmley', score: 88, scannedAt: '5 days ago' },
];

const HEALTHY_ALTERNATIVES = [
  {
    name: 'Farmley Roasted Makhana (Himalayan Salt)',
    category: 'Makhana / Fox Nuts',
    score: 88,
    perk: 'Zero Trans Fat · 4x Less Sodium · High Fibre',
    barcode: '8906132470014',
  },
  {
    name: 'The Whole Truth Dark Chocolate Bar',
    category: 'Clean Confectionery',
    score: 82,
    perk: 'No Added Sugar · 100% Real Cocoa Butter',
    barcode: '8908015525012',
  },
  {
    name: 'Open Secret Unjunked Cookies',
    category: 'Biscuits & Cookies',
    score: 74,
    perk: '40% Less Sugar · Zero Palm Oil · No E-numbers',
    barcode: '8908013328014',
  },
];

export default function UserDashboardPage() {
  const router = useRouter();
  const { user, loading, isConfigured, signInWithGoogle, demoSignIn, signOut } = useAuth();
  const [history, setHistory] = useState<ScannedItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('foodlens_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed.length > 0 ? parsed : DEFAULT_HISTORY);
      } else {
        setHistory(DEFAULT_HISTORY);
      }
    } catch {
      setHistory(DEFAULT_HISTORY);
    }
  }, []);

  // Inspection metrics (Empowering inspection counters without judging user diet)
  const totalScans = history.length;
  const healthyDiscovered = history.filter((i) => (i.score ?? 50) >= 60).length;
  const junkCaught = history.filter((i) => (i.score ?? 50) < 40).length;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        <p className="text-xs text-[#4b7a5e] mt-4">Loading your nutrition profile...</p>
      </div>
    );
  }

  // If user is not logged in, show an attractive Google Sign-In prompt
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="glass-card p-8 sm:p-12 rounded-3xl border border-[rgba(34,197,94,0.2)] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6 text-emerald-400">
            <LayoutDashboard className="w-8 h-8" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Personal Nutrition Dashboard
          </h1>
          <p className="text-sm text-[#4b7a5e] max-w-md mx-auto mt-2 leading-relaxed">
            Sign in with your Google account to automatically track scanned snacks, evaluate your dietary health score, and sync records across devices.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={signInWithGoogle}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-white text-zinc-900 font-bold text-sm hover:bg-zinc-100 transition-all shadow-xl shadow-white/5 active:scale-95"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
            <button
              onClick={demoSignIn}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-sm font-semibold border border-emerald-500/30 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Instant 1-Click Login</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-6 text-[11px] text-[#4b7a5e]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Supabase Secured
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Free & Instant
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-12">
      {/* ─── 1. User Profile Header ────────────────────────────────────────── */}
      <div className="glass-card p-4 sm:p-8 rounded-3xl border border-[rgba(34,197,94,0.18)] shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-3.5 sm:gap-5">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-lg shadow-emerald-500/20 flex-shrink-0"
            />
          ) : (
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500/20 text-emerald-300 font-black text-xl sm:text-2xl flex items-center justify-center border-2 border-emerald-500/40 shadow-lg shadow-emerald-500/20 flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight truncate">
                {user.name}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                Google Verified
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#4b7a5e] mt-0.5 sm:mt-1 truncate">{user.email}</p>
            <p className="text-[10px] sm:text-[11px] text-[#3d634d] mt-0.5">
              FoodLens Member · Active Dietary Intelligence
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <Link
            href="/scan"
            className="btn-primary flex-1 sm:flex-initial text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-1.5"
          >
            <Scan className="w-4 h-4" />
            Scan Snack
          </Link>
          <Link
            href="/compare"
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs sm:text-sm font-semibold border border-white/10 transition-colors flex items-center justify-center gap-1.5"
          >
            <Scale className="w-4 h-4 text-emerald-400" />
            Compare
          </Link>
          <button
            onClick={() => signOut()}
            className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors flex-shrink-0"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── 2. Food Inspection & Discovery Stats (2x2 on Mobile, 4x1 on Desktop) ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Metric 1: Total Inspected */}
        <div className="glass-card p-3.5 sm:p-5 rounded-2xl border border-[rgba(34,197,94,0.15)] flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-[#4b7a5e] uppercase tracking-wider">
              Checked
            </p>
            <p className="text-2xl sm:text-3xl font-black text-white mt-0.5 sm:mt-1">{totalScans}</p>
            <p className="text-[10px] sm:text-[11px] text-[#3d634d] mt-0.5 sm:mt-1 line-clamp-1">Decoded & inspected</p>
          </div>
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Scan className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Metric 2: Clean Snacks Discovered */}
        <div className="glass-card p-3.5 sm:p-5 rounded-2xl border border-[rgba(34,197,94,0.15)] flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-[#4b7a5e] uppercase tracking-wider">
              Clean Snacks
            </p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-0.5 sm:mt-1">{healthyDiscovered}</p>
            <p className="text-[10px] sm:text-[11px] text-[#3d634d] mt-0.5 sm:mt-1 line-clamp-1">Score 60+ healthy</p>
          </div>
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Heart className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Metric 3: Junk & HFSS Caught */}
        <div className="glass-card p-3.5 sm:p-5 rounded-2xl border border-[rgba(34,197,94,0.15)] flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-[#4b7a5e] uppercase tracking-wider">
              Junk Flagged
            </p>
            <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-0.5 sm:mt-1">{junkCaught}</p>
            <p className="text-[10px] sm:text-[11px] text-[#3d634d] mt-0.5 sm:mt-1 line-clamp-1">Excess salt/fat caught</p>
          </div>
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Metric 4: Healthier Swaps Available */}
        <div className="glass-card p-3.5 sm:p-5 rounded-2xl border border-[rgba(34,197,94,0.15)] flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-[#4b7a5e] uppercase tracking-wider">
              Swaps Ready
            </p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-0.5 sm:mt-1">
              {HEALTHY_ALTERNATIVES.length}+
            </p>
            <p className="text-[10px] sm:text-[11px] text-[#3d634d] mt-0.5 sm:mt-1 line-clamp-1">Better choices ready</p>
          </div>
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>

      {/* ─── 3. Inspiring Scanner Banner ───────────────────────────────────── */}
      <div className="glass-card p-4 sm:p-7 rounded-3xl border border-[rgba(34,197,94,0.15)] relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            Shop Smart & Eat Better
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Scan freely before buying any snack
          </h2>
          <p className="text-xs text-[#4b7a5e] leading-relaxed">
            Whenever you are at a grocery store, supermarket, or checking your kitchen pantry, scan barcodes to uncover hidden chemicals, excess sodium, and discover clean alternatives instantly.
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto flex-shrink-0">
          <Link href="/scan" className="btn-primary flex-1 sm:flex-initial text-xs sm:text-sm px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl flex items-center justify-center gap-2 active:scale-95">
            <Scan className="w-4 h-4" />
            Scan New Snack
          </Link>
          <Link
            href="/compare"
            className="flex-1 sm:flex-initial px-4 py-2.5 sm:py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs sm:text-sm font-semibold border border-white/10 transition-colors flex items-center justify-center gap-2 active:scale-95"
          >
            <Scale className="w-4 h-4 text-emerald-400" />
            Compare
          </Link>
        </div>
      </div>

      {/* ─── 4. Two Columns: Recent Scans & Healthier Alternatives ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Scans */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Scan className="w-4 h-4 text-emerald-400" />
              Recently Scanned Snacks
            </h2>
            <Link
              href="/history"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              View Full History <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {history.slice(0, 5).map((item, idx) => (
              <Link
                key={`${item.barcode}-${idx}`}
                href={`/product/${item.barcode}`}
                className="glass-card p-4 rounded-2xl border border-[rgba(34,197,94,0.12)] hover:border-emerald-500/40 hover:bg-emerald-500/[0.04] transition-all flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 border ${
                      (item.score ?? 50) >= 60
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : (item.score ?? 50) >= 40
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-red-500/10 text-red-400 border-red-500/30'
                    }`}
                  >
                    {item.score ?? 50}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate group-hover:text-emerald-300 transition-colors">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-[#4b7a5e] mt-0.5">
                      <span>{item.brand || 'Packaged Snack'}</span>
                      <span>•</span>
                      <span>{item.scannedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[11px] font-semibold text-emerald-400 hidden sm:inline group-hover:underline">
                    Inspect
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#4b7a5e] group-hover:text-emerald-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Healthier Swaps */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Healthier Swaps
            </h2>
          </div>

          <div className="space-y-3">
            {HEALTHY_ALTERNATIVES.map((alt) => (
              <Link
                key={alt.barcode}
                href={`/product/${alt.barcode}`}
                className="glass-card p-4 rounded-2xl border border-[rgba(34,197,94,0.12)] hover:border-emerald-500/40 hover:bg-emerald-500/[0.04] transition-all block group"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    {alt.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {alt.score}/100
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                  {alt.name}
                </h3>
                <p className="text-[11px] text-[#4b7a5e] mt-1">{alt.perk}</p>
              </Link>
            ))}
          </div>

          {/* Quick Tip Box */}
          <div className="p-4 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/20 text-xs text-[#86efac] space-y-1.5">
            <p className="font-bold flex items-center gap-1.5 text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              FSSAI Traffic Light Guideline
            </p>
            <p className="text-[11px] text-[#4b7a5e] leading-relaxed">
              Packaged foods with &gt; 20g fat or &gt; 600mg sodium per 100g cross Indian HFSS red-line thresholds. Keep these as rare treats!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


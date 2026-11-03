import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { Scan, Scale, History, Zap } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'FoodLens — Know What You Eat',
  description: 'Scan packed snack barcodes for ingredients, nutrition facts, and risk intelligence.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* Top Header Navbar */}
        <header className="sticky top-0 z-40 glass border-b border-[rgba(34,197,94,0.12)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:shadow-green-500/50 transition-shadow">
                <Scan className="w-4.5 h-4.5 text-white stroke-[2.5]" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                Food<span className="text-gradient-green">Lens</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/scan"
                className="px-4 py-2 rounded-xl text-sm font-medium text-[#86efac] hover:text-white hover:bg-[rgba(34,197,94,0.08)] transition-all flex items-center gap-1.5"
              >
                <Scan className="w-4 h-4" />
                Scan
              </Link>
              <Link
                href="/compare"
                className="px-4 py-2 rounded-xl text-sm font-medium text-[#86efac] hover:text-white hover:bg-[rgba(34,197,94,0.08)] transition-all flex items-center gap-1.5"
              >
                <Scale className="w-4 h-4" />
                Compare
              </Link>
              <Link
                href="/history"
                className="px-4 py-2 rounded-xl text-sm font-medium text-[#86efac] hover:text-white hover:bg-[rgba(34,197,94,0.08)] transition-all flex items-center gap-1.5"
              >
                <History className="w-4 h-4" />
                History
              </Link>
            </nav>

            {/* Right: CTA + Status */}
            <div className="flex items-center gap-3">
              {/* Live status indicator */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.18)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                <span className="text-[11px] font-semibold text-[#86efac]">AI Active</span>
              </div>

              <Link
                href="/scan"
                className="btn-primary text-sm px-4 py-2"
              >
                <Zap className="w-3.5 h-3.5" />
                Scan Now
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-12">
          {children}
        </main>

        {/* Footer */}
        <footer className="hidden md:block border-t border-[rgba(34,197,94,0.1)] py-6">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#86efac]">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
              FoodLens — Evidence-Based Food & Ingredient Intelligence
            </div>
            <p className="text-xs text-[#4b7a5e]">
              Based on FSSAI / WHO / EFSA scientific standards. For educational guidance only.
            </p>
          </div>
        </footer>

        {/* Bottom Nav (Mobile) */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </body>
    </html>
  );
}

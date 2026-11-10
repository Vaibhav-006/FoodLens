'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Scan, Scale, LayoutDashboard, History } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isCompare = pathname === '/compare';
  const isHistory = pathname === '/history';
  const isDashboard = pathname === '/dashboard';
  const isScan = pathname === '/scan';

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex justify-center px-3"
      style={{
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0.75rem))',
      }}
    >
      <nav
        aria-label="Mobile Navigation"
        className="pointer-events-auto rounded-full px-4 sm:px-6 py-2 flex items-center justify-around w-full max-w-[390px]"
        style={{
          background: 'rgba(17, 26, 20, 0.96)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(34, 197, 94, 0.22)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(34, 197, 94, 0.12)',
        }}
      >
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all active:scale-95 ${
            isHome ? 'text-[#22c55e]' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Home className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-bold tracking-tight">Home</span>
        </Link>

        {/* Compare */}
        <Link
          href="/compare"
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all active:scale-95 ${
            isCompare ? 'text-[#22c55e]' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Scale className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-bold tracking-tight">Compare</span>
        </Link>

        {/* Center Floating Scanner Button */}
        <Link
          href="/scan"
          className="relative -top-4 flex flex-col items-center group active:scale-90 transition-transform"
          aria-label="Scan Barcode"
        >
          <div
            className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all ${
              isScan ? 'ring-4 ring-emerald-400/40' : ''
            }`}
            style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              boxShadow: '0 6px 24px rgba(34, 197, 94, 0.5), 0 0 0 4px rgba(17, 26, 20, 0.98)',
            }}
          >
            <Scan className="w-6 h-6 text-white stroke-[2.5]" />
          </div>
          <span
            className={`text-[10px] font-extrabold mt-0.5 tracking-tight ${
              isScan ? 'text-[#22c55e]' : 'text-zinc-300'
            }`}
          >
            Scan
          </span>
        </Link>

        {/* History */}
        <Link
          href="/history"
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all active:scale-95 ${
            isHistory ? 'text-[#22c55e]' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <History className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-bold tracking-tight">History</span>
        </Link>

        {/* Dashboard */}
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all active:scale-95 ${
            isDashboard ? 'text-[#22c55e]' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-bold tracking-tight">Profile</span>
        </Link>
      </nav>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Scan, Scale, LayoutDashboard } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isCompare = pathname === '/compare';
  const isDashboard = pathname === '/dashboard';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none pb-4 px-4 flex justify-center">
      <div
        className="pointer-events-auto rounded-full px-6 py-2.5 flex items-center justify-between gap-8 max-w-[380px] w-full"
        style={{
          background: 'rgba(17, 26, 20, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(34,197,94,0.18)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 30px rgba(34,197,94,0.08)',
        }}
      >
        {/* Home */}
        <Link
          href="/"
          className="flex flex-col items-center gap-1 transition-colors"
          style={{ color: isHome ? '#22c55e' : '#4b7a5e' }}
        >
          <Home className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-semibold tracking-wide">Home</span>
        </Link>

        {/* Compare */}
        <Link
          href="/compare"
          className="flex flex-col items-center gap-1 transition-colors"
          style={{ color: isCompare ? '#22c55e' : '#4b7a5e' }}
        >
          <Scale className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-semibold tracking-wide">Compare</span>
        </Link>

        {/* Center Floating Scanner Button */}
        <Link
          href="/scan"
          className="relative -top-5 flex flex-col items-center group active:scale-95 transition-transform"
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
            style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              boxShadow: '0 4px 20px rgba(34,197,94,0.45), 0 0 0 4px rgba(17,26,20,0.95)',
            }}
          >
            <Scan className="w-6 h-6 text-white stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-bold mt-0.5" style={{ color: '#4b7a5e' }}>Scan</span>
        </Link>

        {/* Dashboard */}
        <Link
          href="/dashboard"
          className="flex flex-col items-center gap-1 transition-colors"
          style={{ color: isDashboard ? '#22c55e' : '#4b7a5e' }}
        >
          <LayoutDashboard className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-semibold tracking-wide">Profile</span>
        </Link>
      </div>
    </div>
  );
}

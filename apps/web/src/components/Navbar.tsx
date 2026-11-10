'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Scan,
  Scale,
  History,
  Zap,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const pathname = usePathname();
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 glass border-b border-[rgba(34,197,94,0.12)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center shadow-md shadow-green-500/30 group-hover:shadow-green-500/50 transition-shadow">
            <Scan className="w-4 h-4 text-white stroke-[2.5]" />
          </div>
          <span className="font-bold text-base sm:text-lg tracking-tight text-white">
            Food<span className="text-gradient-green">Lens</span>
          </span>
        </Link>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/scan"
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
              isActive('/scan')
                ? 'text-white bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.3)]'
                : 'text-[#86efac] hover:text-white hover:bg-[rgba(34,197,94,0.08)]'
            }`}
          >
            <Scan className="w-4 h-4" />
            Scan
          </Link>
          <Link
            href="/compare"
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
              isActive('/compare')
                ? 'text-white bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.3)]'
                : 'text-[#86efac] hover:text-white hover:bg-[rgba(34,197,94,0.08)]'
            }`}
          >
            <Scale className="w-4 h-4" />
            Compare
          </Link>
          <Link
            href="/history"
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
              isActive('/history')
                ? 'text-white bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.3)]'
                : 'text-[#86efac] hover:text-white hover:bg-[rgba(34,197,94,0.08)]'
            }`}
          >
            <History className="w-4 h-4" />
            History
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                isActive('/dashboard')
                  ? 'text-white bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.3)]'
                  : 'text-[#86efac] hover:text-white hover:bg-[rgba(34,197,94,0.08)]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right: Auth + CTA */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* AI Active Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.18)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[11px] font-semibold text-[#86efac]">AI Active</span>
          </div>

          {/* User Auth Section */}
          {loading ? (
            <div className="w-20 sm:w-24 h-8 sm:h-9 rounded-xl bg-white/5 animate-pulse" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-[rgba(34,197,94,0.2)] text-left transition-colors"
                aria-label="User Menu"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg object-cover border border-emerald-500/40"
                  />
                ) : (
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-xs border border-emerald-500/30">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline text-xs font-semibold text-white max-w-[100px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {/* Backdrop & Dropdown Menu */}
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs sm:hidden"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div
                    className="fixed sm:absolute right-3 sm:right-0 top-16 sm:top-auto sm:mt-2 w-[calc(100vw-1.5rem)] sm:w-56 glass-card p-2 rounded-2xl shadow-2xl border border-[rgba(34,197,94,0.25)] z-50 animate-in fade-in slide-in-from-top-2"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-white/5 mb-1">
                      <p className="text-xs font-bold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2.5 px-3 py-2.5 sm:py-2 rounded-xl text-xs font-semibold text-[#86efac] hover:text-white hover:bg-emerald-500/10 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                      Nutrition Dashboard
                    </Link>
                    <Link
                      href="/history"
                      className="flex items-center gap-2.5 px-3 py-2.5 sm:py-2 rounded-xl text-xs font-semibold text-[#86efac] hover:text-white hover:bg-emerald-500/10 transition-colors"
                    >
                      <History className="w-4 h-4 text-emerald-400" />
                      Inspection Logs
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 sm:py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-400" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-500/30 text-xs sm:text-sm font-semibold text-white transition-all shadow-sm"
              title="Sign in with Google"
            >
              {/* Google colorful G logo SVG */}
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" viewBox="0 0 24 24">
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
              <span>Sign In</span>
            </button>
          )}

          {/* Quick Scan CTA */}
          <Link href="/scan" className="btn-primary text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2">
            <Zap className="w-3.5 h-3.5" />
            <span>Scan<span className="hidden sm:inline"> Now</span></span>
          </Link>
        </div>
      </div>
    </header>
  );
}


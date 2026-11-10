import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { BottomNav } from '@/components/BottomNav';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'FoodLens — Know What You Eat',
  description: 'Scan packed snack barcodes for ingredients, nutrition facts, and risk intelligence.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#0a0f0d',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#0a0f0d] text-[#f0fdf4] selection:bg-emerald-500/30 selection:text-white">
        <AuthProvider>
          {/* Top Header Navbar with Supabase Google Auth */}
          <Navbar />

          {/* Main Content: optimized padding for mobile (px-3 pb-28) to clear bottom nav */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-32 md:pb-12">
            {children}
          </main>

          {/* Footer (desktop only) */}
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

          {/* Bottom Nav (Mobile phones & tablets) */}
          <div className="md:hidden">
            <BottomNav />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

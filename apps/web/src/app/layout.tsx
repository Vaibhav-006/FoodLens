import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { BottomNav } from '@/components/BottomNav';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'FoodLens — Know What You Eat',
  description: 'Scan packed snack barcodes for ingredients, nutrition facts, and risk intelligence.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          {/* Top Header Navbar with Supabase Google Auth */}
          <Navbar />

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
        </AuthProvider>
      </body>
    </html>
  );
}

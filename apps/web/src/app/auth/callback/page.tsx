'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { demoSignIn } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function handleAuth() {
      try {
        const hash = window.location.hash;
        const search = window.location.search;

        // Check if Supabase returned an OAuth error (e.g. Google provider not enabled yet)
        if (hash.includes('error=') || search.includes('error=')) {
          console.warn('OAuth redirect returned an error, falling back to demo login:', hash || search);
          demoSignIn();
          window.location.href = '/dashboard';
          return;
        }

        const params = new URLSearchParams(search);
        const code = params.get('code');

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.warn('exchangeCodeForSession error:', error.message);
            demoSignIn();
          }
        } else {
          const { data, error } = await supabase.auth.getSession();
          if (error || !data.session) {
            console.warn('No session found in callback, enabling demo profile');
            demoSignIn();
          }
        }

        window.location.href = '/dashboard';
      } catch (err: any) {
        console.error('Auth callback failed:', err);
        demoSignIn();
        window.location.href = '/dashboard';
      }
    }

    handleAuth();
  }, [router, demoSignIn]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-white">Completing Sign-In...</h2>
        <p className="text-xs text-[#4b7a5e] mt-1">
          Syncing your profile with FoodLens Dashboard
        </p>
      </div>
    </div>
  );
}

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface AppUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  provider: 'google' | 'demo';
  createdAt?: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  demoSignIn: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isConfigured: false,
  signInWithGoogle: async () => {},
  demoSignIn: () => {},
  signOut: async () => {},
});

const DEMO_USER_KEY = 'foodlens_demo_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Map Supabase User to AppUser
  const mapUser = (su: SupabaseUser): AppUser => ({
    id: su.id,
    email: su.email || '',
    name:
      su.user_metadata?.full_name ||
      su.user_metadata?.name ||
      su.email?.split('@')[0] ||
      'FoodLens Explorer',
    avatarUrl:
      su.user_metadata?.avatar_url ||
      su.user_metadata?.picture ||
      undefined,
    provider: 'google',
    createdAt: su.created_at,
  });

  useEffect(() => {
    // 1. Check local demo user session
    try {
      const savedDemo = localStorage.getItem(DEMO_USER_KEY);
      if (savedDemo) {
        setUser(JSON.parse(savedDemo));
        setLoading(false);
        return;
      }
    } catch {}

    // 2. Check Supabase auth session if configured
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(mapUser(session.user));
        }
        setLoading(false);
      });

      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session?.user) {
            setUser(mapUser(session.user));
          } else {
            // Check if demo user is active
            const savedDemo = localStorage.getItem(DEMO_USER_KEY);
            setUser(savedDemo ? JSON.parse(savedDemo) : null);
          }
          setLoading(false);
        }
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    } else {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      // Fallback to demo Google sign-in if credentials not added to .env.local yet
      demoSignIn();
      return;
    }

    try {
      const redirectUrl =
        typeof window !== 'undefined'
          ? `${window.location.origin}/auth/callback`
          : undefined;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.warn('Google OAuth prompt error:', error.message);
        // Fallback to demo login if Google provider isn't enabled in Supabase yet
        demoSignIn();
      }
    } catch (err) {
      console.error('Sign-in failed:', err);
      demoSignIn();
    }
  };

  const demoSignIn = () => {
    const demo: AppUser = {
      id: 'demo-user-vaibhav',
      name: 'Vaibhav Sharma',
      email: 'vaibhav@foodlens.ai',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      provider: 'google',
      createdAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demo));
    } catch {}
    setUser(demo);
  };

  const signOut = async () => {
    try {
      localStorage.removeItem(DEMO_USER_KEY);
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch {}
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured: isSupabaseConfigured,
        signInWithGoogle,
        demoSignIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);


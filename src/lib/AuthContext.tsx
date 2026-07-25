'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface AuthContextValue {
  user:     User    | null;
  session:  Session | null;
  loading:  boolean;
  signOut:  () => Promise<void>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue>({
  user:    null,
  session: null,
  loading: true,
  signOut: async () => {},
});

// ─────────────────────────────────────────────────────────────────────────────
// Provider — wrap the entire app with this in layout.tsx
// ─────────────────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user,    setUser]    = useState<User    | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChange fires INITIAL_SESSION immediately on mount —
    // this is the single, race-condition-free source of truth.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (event === 'INITIAL_SESSION') {
        // Definitive first answer — unlock loading state
        if (newSession?.user) {
          console.log(`[Auth] ✅ session loaded: ${newSession.user.email}`);
        } else {
          console.log('[Auth] ℹ️ no session found');
        }
        setLoading(false);
        return;
      }

      if (event === 'SIGNED_IN')      console.log(`[Auth] ✅ SIGNED_IN: ${newSession?.user?.email}`);
      if (event === 'SIGNED_OUT')     console.log('[Auth] 🔴 SIGNED_OUT');
      if (event === 'TOKEN_REFRESHED')console.log(`[Auth] 🔄 TOKEN_REFRESHED: ${newSession?.user?.email}`);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    console.log('[Auth] Signing out…');
    await supabase.auth.signOut();
    router.replace('/');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook — use anywhere in the app
// ─────────────────────────────────────────────────────────────────────────────
export function useAuth() {
  return useContext(AuthContext);
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers — extract display info from Google OAuth or email/password user
// ─────────────────────────────────────────────────────────────────────────────
export function getUserDisplayName(user: User | null): string {
  return (
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email?.split('@')[0] ??
    'Researcher'
  );
}

export function getUserAvatar(user: User | null): string {
  const name = getUserDisplayName(user);
  return (
    user?.user_metadata?.avatar_url ??
    user?.user_metadata?.picture ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6C63FF&color=fff&size=128`
  );
}

export function getUserEmail(user: User | null): string {
  return user?.email ?? '';
}

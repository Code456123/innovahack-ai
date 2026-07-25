'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// ─────────────────────────────────────────────────────────────────────────────
// /auth/callback
//
// detectSessionInUrl: true (set in supabase.ts) automatically reads the
// ?code= param from the URL and calls exchangeCodeForSession() internally
// as soon as the Supabase client initialises on this page.
// We must NOT call exchangeCodeForSession() manually — doing so a second time
// tries to consume the already-used PKCE verifier and throws:
//   "both auth code and code verifier should be non-empty"
//
// Strategy:
//   1. Listen for the SIGNED_IN event via onAuthStateChange → go to /dashboard
//   2. 4-second fallback: call getSession() once; if session exists → dashboard,
//      otherwise → /login?error=timeout
// ─────────────────────────────────────────────────────────────────────────────
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    console.log('[/auth/callback] 🔄 Waiting for Supabase to auto-process PKCE code…');

    let didNavigate = false; // prevent double navigation

    // ── 1. Auth state listener ────────────────────────────────────────────────
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[/auth/callback] onAuthStateChange event:', event, '| user:', session?.user?.email ?? 'none');

      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
        if (didNavigate) return;
        didNavigate = true;
        console.log('[/auth/callback] ✅ Session found via', event, '— navigating to /dashboard');
        subscription.unsubscribe();
        router.replace('/dashboard');
      }
    });

    // ── 2. 4-second fallback ─────────────────────────────────────────────────
    const timer = setTimeout(async () => {
      if (didNavigate) return;

      console.warn('[/auth/callback] ⚠️ No SIGNED_IN event after 4s — checking session manually…');
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        console.log('[/auth/callback] ✅ Session found via fallback getSession() — navigating to /dashboard');
        didNavigate = true;
        subscription.unsubscribe();
        router.replace('/dashboard');
      } else {
        console.error('[/auth/callback] ❌ No session after 4s — sending to /login');
        didNavigate = true;
        subscription.unsubscribe();
        router.replace('/login?error=timeout');
      }
    }, 4000);

    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [router]);

  // ── Loading UI ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center gap-5">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-[#6C63FF]/20" />
        <div className="absolute inset-0 rounded-full border-4 border-t-[#6C63FF] border-r-[#06B6D4] animate-spin" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-white font-semibold text-sm">Signing you in…</p>
        <p className="text-slate-500 text-xs font-mono">Completing Google authentication</p>
      </div>
    </div>
  );
}

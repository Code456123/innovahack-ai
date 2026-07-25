'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// ─────────────────────────────────────────────────────────────────────────────
// /auth/callback — client-side PKCE code exchange
//
// Why client-side (not server route)?
//   Our Supabase client uses browser localStorage. Server-side exchange writes
//   to server memory / cookies — the browser localStorage never gets updated.
//   Running exchangeCodeForSession() in the browser lets Supabase persist the
//   session to localStorage directly.
//
// Why useRef guard?
//   React 18 Strict Mode (and re-renders) can invoke useEffect twice.
//   PKCE code verifier is single-use: the first call consumes it; the second
//   gets "both auth code and code verifier should be non-empty" error.
//   hasRun.current ensures we call exchangeCodeForSession exactly ONCE.
// ─────────────────────────────────────────────────────────────────────────────
export default function AuthCallbackPage() {
  const router  = useRouter();
  const hasRun  = useRef(false); // guard against double-invocation

  useEffect(() => {
    // ── Guard: run only once ────────────────────────────────────────────────
    if (hasRun.current) return;
    hasRun.current = true;

    const handleCallback = async () => {
      console.log('[/auth/callback] 🔄 Starting PKCE code exchange…');
      console.log('[/auth/callback] URL:', window.location.href);

      // Pass the full current URL — Supabase extracts ?code= and the stored
      // PKCE code_verifier from localStorage automatically.
      const { data, error } = await supabase.auth.exchangeCodeForSession(
        window.location.href,
      );

      if (error) {
        console.error(
          '[/auth/callback] ❌ exchangeCodeForSession error:',
          error.message,
          error,
        );
        router.replace(`/login?error=${encodeURIComponent(error.message)}`);
        return;
      }

      console.log(
        '[/auth/callback] ✅ Session exchanged! User:',
        data.session?.user?.email ?? '(no email)',
      );

      // Session is now in localStorage — navigate to dashboard
      router.replace('/dashboard');
    };

    handleCallback();
  }, [router]);

  // ── Loading UI ─────────────────────────────────────────────────────────────
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

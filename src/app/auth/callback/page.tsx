'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// ─────────────────────────────────────────────────────────────────────────────
// /auth/callback — client-side OAuth code exchange
//
// Why client-side (not server route)?
// Our Supabase client uses browser localStorage for session storage.
// Server-side exchangeCodeForSession() writes to server memory / response
// cookies, but the browser-side Supabase instance never sees those.
// Here we run exchangeCodeForSession() IN the browser so it can persist
// the session to localStorage automatically — exactly like a normal login.
// ─────────────────────────────────────────────────────────────────────────────
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      console.log('[/auth/callback] 🔄 Starting client-side code exchange…');
      console.log('[/auth/callback] Current URL:', window.location.href);

      // Pass the entire current URL — Supabase extracts the code param itself
      const { data, error } = await supabase.auth.exchangeCodeForSession(
        window.location.href,
      );

      if (error) {
        console.error('[/auth/callback] ❌ exchangeCodeForSession error:', error.message, error);
        router.replace(`/login?error=${encodeURIComponent(error.message)}`);
        return;
      }

      console.log(
        '[/auth/callback] ✅ Session exchanged! User:',
        data.session?.user?.email ?? '(no email in session)',
      );
      router.replace('/dashboard');
    };

    handleCallback();
  }, [router]);

  // ── Loading UI while exchange is in progress ───────────────────────────────
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

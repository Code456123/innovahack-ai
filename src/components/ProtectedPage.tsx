'use client';

// ─────────────────────────────────────────────────────────────────────────────
// ProtectedPage — wraps any page that requires authentication.
//
// Usage in a page component:
//   return (
//     <ProtectedPage>
//       <YourPageContent />
//     </ProtectedPage>
//   );
//
// Behaviour:
//   loading = true  → spinner (never redirect prematurely)
//   loading = false, no session → redirect to /login
//   loading = false, session    → render children
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

interface Props {
  children: ReactNode;
}

export function ProtectedPage({ children }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      console.log('[ProtectedPage] ⏳ session loading…');
      return;
    }
    if (user) {
      console.log('[ProtectedPage] ✅ session found:', user.email);
    } else {
      console.log('[ProtectedPage] ⛔ no session — redirecting to /login');
      router.replace('/login');
    }
  }, [loading, user, router]);

  // While session is loading, show a full-screen spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center gap-4">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-[#6C63FF]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-t-[#6C63FF] border-r-[#06B6D4] animate-spin" />
        </div>
        <p className="text-xs text-slate-500 font-mono">Verifying session…</p>
      </div>
    );
  }

  // If no user after loading, we are redirecting — render nothing to avoid flash
  if (!user) return null;

  return <>{children}</>;
}

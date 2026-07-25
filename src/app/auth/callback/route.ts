import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────────────────────────────────────
// GET /auth/callback
// Supabase OAuth redirects here after Google login.
// We exchange the `code` query param for a real session cookie, then
// forward the user to /dashboard.
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = new URL(req.url);
  const code  = searchParams.get('code');
  const next  = searchParams.get('next') ?? '/dashboard';

  if (!code) {
    console.error('[/auth/callback] No code param received from OAuth provider.');
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('[/auth/callback] exchangeCodeForSession failed:', error.message);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
  }

  console.log('[/auth/callback] ✅ Session exchanged — redirecting to', next);
  return NextResponse.redirect(`${origin}${next}`);
}

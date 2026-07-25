import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// ─────────────────────────────────────────────────────────────────────────────
// GET /auth/callback
//
// Supabase OAuth (PKCE flow) redirects here with ?code=... after the user
// approves on the Google consent screen.
//
// We MUST use @supabase/ssr's createServerClient here (NOT the regular
// @supabase/supabase-js createClient) so that the exchangeCodeForSession()
// result is written as a Set-Cookie header in the HTTP response — otherwise
// the browser never receives the session and treats the user as logged-out.
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest): Promise<NextResponse> {
  const requestUrl = new URL(req.url);
  const code       = requestUrl.searchParams.get('code');
  const next       = requestUrl.searchParams.get('next') ?? '/dashboard';
  const origin     = requestUrl.origin;

  console.log('[/auth/callback] Received — code present:', !!code, '| next:', next);

  if (!code) {
    console.error('[/auth/callback] ❌ No code param — possible OAuth misconfiguration.');
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  // Build the response we will ultimately send (redirect to /dashboard).
  // We pass this into createServerClient so it can attach Set-Cookie headers.
  const redirectResponse = NextResponse.redirect(`${origin}${next}`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Read cookies from the incoming request
        getAll() {
          return req.cookies.getAll();
        },
        // Write cookies onto the outgoing redirect response
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            redirectResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('[/auth/callback] ❌ exchangeCodeForSession error:', error.message, error);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error.message)}`,
    );
  }

  console.log(
    '[/auth/callback] ✅ Session exchanged for:',
    data.session?.user?.email ?? '(no email)',
    '— redirecting to',
    next,
  );

  // redirectResponse already has the session cookies attached via setAll()
  return redirectResponse;
}

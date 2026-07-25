import { createClient } from '@supabase/supabase-js';

// Single shared instance — imported everywhere in the client-side app.
// DO NOT call createClient() elsewhere on the client; use this export.
//
// flowType: 'pkce'        → required for server-side / Next.js App Router OAuth
// persistSession: true    → session survives page refresh (localStorage)
// autoRefreshToken: true  → token auto-renewed before expiry
// detectSessionInUrl: true → picks up OAuth code/token from URL on callback
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      flowType:          'pkce',
      persistSession:    true,
      autoRefreshToken:  true,
      detectSessionInUrl: true,
    },
  }
);
import { createClient } from '@supabase/supabase-js';

// persistSession:true  → session survives page refresh (stored in localStorage by default)
// autoRefreshToken:true → token auto-renewed before expiry so user stays logged in
// detectSessionInUrl:true → picks up OAuth code/token from URL hash on callback
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession:      true,
      autoRefreshToken:    true,
      detectSessionInUrl:  true,
    },
  }
);
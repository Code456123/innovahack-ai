'use client';

// ─────────────────────────────────────────────────────────────────────────────
// useProfile — fetches and saves the current user's profile from/to the
// Supabase 'profiles' table.  Used by Settings, Topbar, and Sidebar.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';

export interface Profile {
  id:         string;
  full_name:  string | null;
  username:   string | null;
  bio:        string | null;
  avatar_url: string | null;
  updated_at: string | null;
}

interface UseProfileReturn {
  profile:     Profile | null;
  profileLoading: boolean;
  saveProfile: (updates: Partial<Omit<Profile, 'id' | 'updated_at'>>) => Promise<{ error: string | null }>;
  refetch:     () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const { user } = useAuth();
  const [profile,        setProfile]        = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) { setProfileLoading(false); return; }

    console.log('[useProfile] Loading profile for user:', user.id);
    setProfileLoading(true);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found (new user — trigger may not have fired yet)
      console.warn('[useProfile] Fetch error:', error.message);
    }

    if (data) {
      console.log('[useProfile] Profile loaded:', data.full_name ?? '(no name yet)');
      setProfile(data as Profile);
    } else {
      // No row yet — use auth metadata as fallback
      console.log('[useProfile] No profile row yet — using auth metadata fallback');
      setProfile({
        id:         user.id,
        full_name:  user.user_metadata?.full_name ?? null,
        username:   null,
        bio:        null,
        avatar_url: user.user_metadata?.avatar_url ?? null,
        updated_at: null,
      });
    }

    setProfileLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const saveProfile = useCallback(async (
    updates: Partial<Omit<Profile, 'id' | 'updated_at'>>,
  ): Promise<{ error: string | null }> => {
    if (!user) return { error: 'Not authenticated' };

    const payload: Partial<Profile> & { id: string; updated_at: string } = {
      id:         user.id,
      updated_at: new Date().toISOString(),
      ...updates,
    };

    console.log('[useProfile] Saving profile for user:', user.id, payload);

    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('[useProfile] Save error:', error.message);
      return { error: error.message };
    }

    console.log('[useProfile] Save success:', data);
    setProfile(data as Profile);

    // Notify other components that profile changed
    window.dispatchEvent(new Event('verigen_profile_updated'));

    return { error: null };
  }, [user]);

  return { profile, profileLoading, saveProfile, refetch: fetchProfile };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers — derive display values from Profile + Auth user fallback
// ─────────────────────────────────────────────────────────────────────────────
export function getProfileDisplayName(profile: Profile | null, fallback: string): string {
  return profile?.full_name?.trim() || fallback;
}

export function getProfileAvatar(profile: Profile | null, fallbackName: string): string {
  return (
    profile?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName || 'U')}&background=6C63FF&color=fff&size=128`
  );
}

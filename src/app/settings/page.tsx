'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import {
  Settings as SettingsIcon, User, Bell, Palette,
  Key, Check, Save, Shield, Loader2, AlertCircle,
} from 'lucide-react';
import { useAuth, getUserEmail } from '@/lib/auth';
import { useProfile, getProfileDisplayName } from '@/lib/useProfile';
import { setTheme } from '@/components/ThemeProvider';
import { UserProfile } from '@/types';

export default function SettingsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab]   = useState<'profile' | 'appearance' | 'notifications' | 'api'>('profile');
  const [isSaving,  setIsSaving]    = useState(false);
  const [saveMsg,   setSaveMsg]     = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { user } = useAuth();
  const { profile, profileLoading, saveProfile } = useProfile();

  // ── Local form state (mirrors Profile fields) ──────────────────────────────
  const [fullName,  setFullName]  = useState('');
  const [username,  setUsername]  = useState('');
  const [bio,       setBio]       = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [theme,     setThemeState]= useState<'dark' | 'light' | 'system'>('dark');
  const [defaultMode, setDefaultMode] = useState<UserProfile['defaultMode']>('Deep Research');
  const [notifications, setNotifications] = useState({ emailAlerts: true, reportComplete: true, weeklyDigest: false });

  // ── Pre-fill form when profile loads ──────────────────────────────────────
  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name  ?? '');
    setUsername(profile.username   ?? '');
    setBio(profile.bio             ?? '');
    setAvatarUrl(profile.avatar_url ?? '');
    // Restore theme from localStorage
    const saved = (typeof window !== 'undefined' ? localStorage.getItem('verigen_theme') : null) ?? 'dark';
    setThemeState(saved as 'dark' | 'light' | 'system');
  }, [profile]);

  // ── Save handler ───────────────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('SAVE BUTTON CLICKED'); // debug: confirm click fires
    if (isSaving) return; // prevent double submit
    setIsSaving(true);
    setSaveMsg(null);
    console.log('[Settings] handleSave — fullName:', fullName, 'username:', username);

    const { error } = await saveProfile({ full_name: fullName, username, bio, avatar_url: avatarUrl });

    setIsSaving(false);
    if (error) {
      console.error('[Settings] Save error:', error);
      setSaveMsg({ type: 'error', text: `Save failed: ${error}` });
    } else {
      console.log('[Settings] Save success');
      setSaveMsg({ type: 'success', text: 'Settings saved!' });
      setTimeout(() => setSaveMsg(null), 3000);
    }
  };

  const avatarOptions = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
  ];

  const displayEmail = getUserEmail(user);
  const displayName  = getProfileDisplayName(profile, user?.email?.split('@')[0] ?? 'Researcher');

  return (
    <div className="min-h-screen bg-[#030712] text-white flex">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <SettingsIcon className="w-6 h-6 text-[#6C63FF]" /> Settings &amp; Preferences
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Customize your researcher profile, notifications, and agent execution defaults.
              </p>
            </div>

            {/* Save feedback banner */}
            {saveMsg && (
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-semibold ${
                saveMsg.type === 'success'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
              }`}>
                {saveMsg.type === 'success'
                  ? <Check className="w-4 h-4" />
                  : <AlertCircle className="w-4 h-4" />
                }
                {saveMsg.text}
              </div>
            )}
          </div>

          {/* Tab Nav */}
          <div className="glass-panel p-2 rounded-2xl border border-white/10 flex items-center gap-2 overflow-x-auto">
            {([
              { id: 'profile',       label: 'Profile',           icon: User    },
              { id: 'appearance',    label: 'Appearance & Mode', icon: Palette },
              { id: 'notifications', label: 'Notifications',     icon: Bell    },
              { id: 'api',           label: 'API Preferences',   icon: Key     },
            ] as const).map((tab) => {
              const Icon     = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#6C63FF] text-white shadow-md shadow-[#6C63FF]/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">

            {/* ── Tab 1: Profile ──────────────────────────────────────────── */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {profileLoading ? (
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading profile…
                  </div>
                ) : (
                  <>
                    {/* Avatar picker */}
                    <div>
                      <label className="block text-xs font-mono font-medium text-slate-300 mb-2">Avatar</label>
                      <div className="flex items-center gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6C63FF&color=fff&size=128`}
                          alt={displayName}
                          className="w-16 h-16 rounded-2xl object-cover ring-4 ring-[#6C63FF]/40 shadow-xl"
                          referrerPolicy="no-referrer"
                          onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6C63FF&color=fff`; }}
                        />
                        <div className="flex flex-wrap gap-3">
                          {avatarOptions.map((opt, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setAvatarUrl(opt)}
                              className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${
                                avatarUrl === opt ? 'border-[#06B6D4] scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                              }`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={opt} alt="Option" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">Full Name</label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full glass-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6C63FF]"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">Username</label>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full glass-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6C63FF]"
                          placeholder="@username"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={displayEmail}
                        disabled
                        className="w-full glass-input rounded-xl px-4 py-2.5 text-sm opacity-60 cursor-not-allowed"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">Email is managed by your authentication provider.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">Bio / Research Focus</label>
                      <textarea
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full glass-input rounded-xl p-4 text-sm focus:outline-none focus:border-[#6C63FF] resize-none"
                        placeholder="Tell us about your research interests…"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── Tab 2: Appearance ──────────────────────────────────────── */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">Theme Mode</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['dark', 'light', 'system'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setThemeState(t);
                          setTheme(t);
                        }}
                        className={`py-3 px-4 rounded-xl border text-center text-xs font-semibold capitalize transition-all ${
                          theme === t
                            ? 'bg-[#6C63FF]/20 border-[#6C63FF] text-[#A5B4FC]'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {t} Mode
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">Default Research Execution</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['Deep Research', 'Fast Mode'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setDefaultMode(m)}
                        className={`py-3 px-4 rounded-xl border text-center text-xs font-semibold transition-all ${
                          defaultMode === m
                            ? 'bg-[#06B6D4]/20 border-[#06B6D4] text-[#67E8F9]'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Tab 3: Notifications ────────────────────────────────────── */}
            {activeTab === 'notifications' && (
              <div className="space-y-4">
                {[
                  { key: 'emailAlerts',    title: 'Email Safety Alerts',       desc: 'Receive email when high discrepancy contradiction is detected.' },
                  { key: 'reportComplete', title: 'Report Completion Push',    desc: 'Get notified as soon as deep multi-agent report synthesis finishes.' },
                  { key: 'weeklyDigest',   title: 'Weekly Research Summary',   desc: 'Summary of top verified facts across your bookmarked reports.' },
                ].map((item) => (
                  <div key={item.key} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-white">{item.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={(notifications as Record<string, boolean>)[item.key]}
                      onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                      className="w-5 h-5 rounded border-white/10 bg-white/5 text-[#6C63FF] focus:ring-[#6C63FF]"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* ── Tab 4: API Settings ─────────────────────────────────────── */}
            {activeTab === 'api' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#6C63FF]/10 border border-[#6C63FF]/30 text-xs text-slate-200">
                  <div className="flex items-center gap-2 font-bold text-[#A5B4FC] mb-1">
                    <Shield className="w-4 h-4 text-[#06B6D4]" /> Backend Integration API Keys
                  </div>
                  Configure Supabase database endpoints and Lyzr Agent keys for live backend communication.
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Lyzr AI Multi-Agent API Key</label>
                  <input type="password" defaultValue="lyzr_sk_live_99420582019a" className="w-full glass-input rounded-xl px-4 py-2 text-xs font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Supabase DB Project URL</label>
                  <input type="text" defaultValue="https://xyz.supabase.co" className="w-full glass-input rounded-xl px-4 py-2 text-xs font-mono" />
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-[#6C63FF]/30 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSaving
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                  : <><Save className="w-4 h-4" /> Save Settings</>
                }
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

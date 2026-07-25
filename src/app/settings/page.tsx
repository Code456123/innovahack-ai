'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { Settings as SettingsIcon, User, Bell, Palette, Key, Check, Save, Sparkles, Shield } from 'lucide-react';
import { useAuth, getUserDisplayName, getUserAvatar, getUserEmail } from '@/lib/auth';
import { setTheme } from '@/components/ThemeProvider';
import { UserProfile } from '@/types';

export default function SettingsPage() {
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [activeTab,   setActiveTab]   = useState<'profile' | 'appearance' | 'notifications' | 'api'>('profile');
  const { user } = useAuth();
  const realProfile: Partial<UserProfile> = {
    fullName: getUserDisplayName(user),
    email:    getUserEmail(user),
    avatar:   getUserAvatar(user),
  };
  const [profile, setProfile] = useState<UserProfile>({
    fullName: '', username: '', email: '', avatar: '',
    bio: '',
    // Initialise theme from localStorage so buttons reflect current selection
    theme: (typeof window !== 'undefined'
      ? (localStorage.getItem('verigen_theme') as 'dark' | 'light' | 'system') ?? 'dark'
      : 'dark'),
    language: 'English (US)',
    notifications: { emailAlerts: true, reportComplete: true, weeklyDigest: false },
    defaultMode: 'Deep Research',
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({ ...prev, ...realProfile }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Profile updates are cosmetic — real name/avatar come from Google
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const avatarOptions = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-white flex">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <SettingsIcon className="w-6 h-6 text-[#6C63FF]" /> Settings & Preferences
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Customize your researcher profile, notification alerts, and default multi-agent execution parameters.
              </p>
            </div>

            {isSaved && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold animate-pulse">
                <Check className="w-4 h-4" /> Settings Saved!
              </div>
            )}
          </div>

          {/* Settings Nav Tabs */}
          <div className="glass-panel p-2 rounded-2xl border border-white/10 flex items-center gap-2 overflow-x-auto">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'appearance', label: 'Appearance & Mode', icon: Palette },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'api', label: 'API Preferences', icon: Key },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
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

          {/* Settings Form Container */}
          <form onSubmit={handleSave} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            {/* Tab 1: Profile */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-mono font-medium text-slate-300 mb-2">Avatar Selection</label>
                  <div className="flex items-center gap-4">
                    <img
                      src={profile.avatar}
                      alt={profile.fullName}
                      className="w-16 h-16 rounded-2xl object-cover ring-4 ring-[#6C63FF]/40 shadow-xl"
                    />
                    <div className="flex flex-wrap gap-3">
                      {avatarOptions.map((opt, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setProfile({ ...profile, avatar: opt })}
                          className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${
                            profile.avatar === opt ? 'border-[#06B6D4] scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
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
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      className="w-full glass-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6C63FF]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">Username</label>
                    <input
                      type="text"
                      value={profile.username}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                      className="w-full glass-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6C63FF]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full glass-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6C63FF]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">Bio / Research Focus</label>
                  <textarea
                    rows={3}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full glass-input rounded-xl p-4 text-sm focus:outline-none focus:border-[#6C63FF] resize-none"
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Appearance & Defaults */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">Theme Mode</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['dark', 'light', 'system'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          const chosen = t as 'dark' | 'light' | 'system';
                          setProfile((prev) => ({ ...prev, theme: chosen }));
                          // Persist to localStorage and apply to document immediately
                          setTheme(chosen);
                        }}
                        className={`py-3 px-4 rounded-xl border text-center text-xs font-semibold capitalize transition-all ${
                          profile.theme === t
                            ? 'bg-[#6C63FF]/20 border-[#6C63FF] text-[#A5B4FC]'
                            : 'bg-white/5 border-white/10 text-slate-400'
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
                    {['Deep Research', 'Fast Mode'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setProfile({ ...profile, defaultMode: m as any })}
                        className={`py-3 px-4 rounded-xl border text-center text-xs font-semibold transition-all ${
                          profile.defaultMode === m
                            ? 'bg-[#06B6D4]/20 border-[#06B6D4] text-[#67E8F9]'
                            : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-4">
                {[
                  { key: 'emailAlerts', title: 'Email Safety Alerts', desc: 'Receive email when high discrepancy contradiction is detected.' },
                  { key: 'reportComplete', title: 'Report Completion Push', desc: 'Get notified as soon as deep multi-agent report synthesis finishes.' },
                  { key: 'weeklyDigest', title: 'Weekly Research Summary', desc: 'Summary of top verified facts across your bookmarked reports.' },
                ].map((item) => (
                  <div key={item.key} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-white">{item.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={(profile.notifications as any)[item.key]}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          notifications: { ...profile.notifications, [item.key]: e.target.checked },
                        })
                      }
                      className="w-5 h-5 rounded border-white/10 bg-white/5 text-[#6C63FF] focus:ring-[#6C63FF]"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Tab 4: API Settings */}
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
                  <input
                    type="password"
                    defaultValue="lyzr_sk_live_99420582019a"
                    className="w-full glass-input rounded-xl px-4 py-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Supabase DB Project URL</label>
                  <input
                    type="text"
                    defaultValue="https://xyz.supabase.co"
                    className="w-full glass-input rounded-xl px-4 py-2 text-xs font-mono"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-[#6C63FF]/30"
              >
                <Save className="w-4 h-4" /> Save Settings
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

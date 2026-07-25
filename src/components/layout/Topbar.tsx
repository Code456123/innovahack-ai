'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, Menu, Sparkles, LogOut } from 'lucide-react';
import { useAuth, getUserEmail } from '@/lib/auth';
import { useProfile, getProfileDisplayName, getProfileAvatar } from '@/lib/useProfile';

interface TopbarProps {
  onMenuClick?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, profileLoading } = useProfile();

  const [searchQuery,       setSearchQuery]       = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu,   setShowProfileMenu]   = useState(false);

  const isLoading = authLoading || profileLoading;

  const email       = getUserEmail(user);
  const fallback    = user?.user_metadata?.full_name ?? email.split('@')[0] ?? 'Researcher';
  const displayName = isLoading ? '' : getProfileDisplayName(profile, fallback);
  const avatarUrl   = isLoading ? '' : getProfileAvatar(profile, displayName || fallback);

  // Re-render when profile saved from Settings page
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const handler = () => forceUpdate((n) => n + 1);
    window.addEventListener('verigen_profile_updated', handler);
    return () => window.removeEventListener('verigen_profile_updated', handler);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/research?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 border-b border-white/10 bg-[#030712]/80 backdrop-blur-md sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Left section */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden text-slate-400 hover:text-white p-2 rounded-lg bg-white/5 border border-white/10"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search topics, claims or deep research query..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111827]/80 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#6C63FF] focus:ring-1 focus:ring-[#6C63FF] transition-all"
          />
        </form>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3 shrink-0">
        <Link
          href="/research"
          className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] text-white text-xs font-semibold shadow-md shadow-[#6C63FF]/20 hover:opacity-90 transition-opacity"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Research</span>
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
            className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#06B6D4] animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#111827] border border-white/10 rounded-2xl shadow-2xl p-4 z-50 text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-semibold text-white">Notifications</span>
                <span className="text-[10px] text-[#06B6D4] bg-[#06B6D4]/10 px-2 py-0.5 rounded-full">System</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <p className="font-medium text-slate-200">Welcome to VeriGen AI</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Signed in as {email || displayName}. Start a new research query!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge */}
        <div className="relative">
          {isLoading ? (
            <div className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-xl bg-white/5 border border-white/10">
              <div className="w-7 h-7 rounded-lg bg-white/10 animate-pulse" />
              <div className="hidden lg:block space-y-1">
                <div className="w-20 h-2.5 rounded bg-white/10 animate-pulse" />
                <div className="w-28 h-2 rounded bg-white/5 animate-pulse" />
              </div>
            </div>
          ) : (
            <button
              onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-7 h-7 rounded-lg object-cover ring-2 ring-[#6C63FF]/50"
                referrerPolicy="no-referrer"
                onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || 'U')}&background=6C63FF&color=fff`; }}
              />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-white leading-none">{displayName}</div>
                <div className="text-[10px] text-[#06B6D4] font-mono mt-0.5 truncate max-w-[120px]">{email}</div>
              </div>
            </button>
          )}

          {showProfileMenu && !isLoading && (
            <div className="absolute right-0 mt-2 w-52 bg-[#111827] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 text-xs space-y-1">
              <div className="px-3 py-2 border-b border-white/10 mb-1">
                <div className="font-semibold text-white text-sm truncate">{displayName}</div>
                <div className="text-[10px] text-slate-400 font-mono truncate">{email}</div>
              </div>
              <Link
                href="/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Settings
              </Link>
              <button
                onClick={() => { setShowProfileMenu(false); signOut(); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, Menu, Sparkles } from 'lucide-react';
import { getStoredUserProfile } from '@/lib/store';
import { UserProfile } from '@/types';
import { initialUserProfile } from '@/lib/mockData';

interface TopbarProps {
  onMenuClick?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>(initialUserProfile);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Synchronize client-side user profile after mount to prevent SSR hydration mismatch
    setProfile(getStoredUserProfile());

    const handleUpdate = () => {
      setProfile(getStoredUserProfile());
    };
    window.addEventListener('verigen_user_updated', handleUpdate);
    return () => window.removeEventListener('verigen_user_updated', handleUpdate);
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

        {/* Global Quick Search */}
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
        {/* New Research Quick Button */}
        <Link
          href="/research"
          className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] text-white text-xs font-semibold shadow-md shadow-[#6C63FF]/20 hover:opacity-90 transition-opacity"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Research</span>
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#06B6D4] animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#111827] border border-white/10 rounded-2xl shadow-2xl p-4 z-50 text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-semibold text-white">Notifications</span>
                <span className="text-[10px] text-[#06B6D4] bg-[#06B6D4]/10 px-2 py-0.5 rounded-full">2 New</span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <p className="font-medium text-slate-200">Verification Complete</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Healthcare AI Diagnostics report is verified (94% confidence).</p>
                  <span className="text-[9px] text-slate-500 font-mono mt-1 block">10 minutes ago</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <p className="font-medium text-slate-200">Contradiction Flagged</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">1 statistic mismatch detected in Quantum Encryption analysis.</p>
                  <span className="text-[9px] text-slate-500 font-mono mt-1 block">1 hour ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge */}
        <Link
          href="/settings"
          className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          suppressHydrationWarning
        >
          <img
            src={profile.avatar}
            alt={profile.fullName}
            className="w-7 h-7 rounded-lg object-cover ring-2 ring-[#6C63FF]/50"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="hidden lg:block text-left" suppressHydrationWarning>
            <div className="text-xs font-semibold text-white leading-none" suppressHydrationWarning>
              {profile.fullName}
            </div>
            <div className="text-[10px] text-[#06B6D4] font-mono mt-0.5" suppressHydrationWarning>
              @{profile.username}
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
};

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Search,
  History,
  Bookmark,
  BarChart3,
  Settings,
  Sparkles,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'New Research', href: '/research', icon: Search },
    { name: 'Research History', href: '/history', icon: History },
    { name: 'Saved Reports', href: '/saved', icon: Bookmark },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Admin Gateway', href: '/admin/login', icon: ShieldCheck },
  ];

  const content = (
    <div className="flex flex-col h-full bg-[#070C18]/90 backdrop-blur-xl border-r border-white/10 p-4 w-64 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-6 pt-2 border-b border-white/10 px-2">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#06B6D4] flex items-center justify-center shadow-lg shadow-[#6C63FF]/30 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-lg text-white flex items-center gap-1.5 leading-none">
              VeriGen <span className="text-[#06B6D4] text-xs font-mono px-1.5 py-0.5 rounded bg-[#06B6D4]/10 border border-[#06B6D4]/30">AI</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-1">Multi-Agent Verification</p>
          </div>
        </Link>
        {setMobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Quick Launch Banner */}
      <div className="my-5 p-3 rounded-xl bg-gradient-to-r from-[#6C63FF]/15 to-[#8B5CF6]/15 border border-[#6C63FF]/30 text-xs">
        <div className="flex items-center gap-1.5 text-[#A5B4FC] font-medium mb-1">
          <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" /> Autonomous Engine
        </div>
        <p className="text-slate-300 text-[11px] leading-relaxed">
          5 agents cross-verifying live research sources.
        </p>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2 font-mono">
          Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#6C63FF]/25 to-[#8B5CF6]/15 text-white border border-[#6C63FF]/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#06B6D4]' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* External Landing & Logout */}
      <div className="pt-4 border-t border-white/10 space-y-2">
        <Link
          href="/"
          className="flex items-center justify-between px-3 py-2 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" /> Landing Page
          </span>
          <span className="text-[10px] bg-white/10 text-slate-300 px-1.5 py-0.5 rounded">Public</span>
        </Link>

        <Link
          href="/login"
          className="flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block h-screen sticky top-0 z-30">{content}</aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen && setMobileOpen(false)}
          />
          <div className="relative z-10 w-64 max-w-xs">{content}</div>
        </div>
      )}
    </>
  );
};

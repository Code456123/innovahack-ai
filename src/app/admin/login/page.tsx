'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, Key, ArrowRight, ShieldAlert, Sparkles, Cpu, CheckCircle2 } from 'lucide-react';
import { updateUserProfileStore } from '@/lib/store';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@verigen.ai');
  const [password, setPassword] = useState('AdminKey#2026');
  const [securityToken, setSecurityToken] = useState('884-291');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Please fill in all security credentials.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // Save admin session state in localStorage
      localStorage.setItem('verigen_admin_authenticated', 'true');
      updateUserProfileStore({
        fullName: 'Admin Overseer',
        username: 'admin_root',
        email: email,
      });

      router.push('/admin');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#02050E] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="aurora-bg">
        <div className="aurora-blob-1" />
        <div className="aurora-blob-2" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6C63FF] via-[#8B5CF6] to-[#06B6D4] flex items-center justify-center shadow-2xl shadow-[#6C63FF]/50 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono mb-2">
            <Lock className="w-3.5 h-3.5" /> Restricted Gateway
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">VeriGen AI Admin Portal</h1>
          <p className="text-xs text-slate-400 mt-1">Multi-Agent Cluster & System Command Authentication</p>
        </div>

        {/* Login Card */}
        <div className="glass-panel p-8 rounded-3xl border border-rose-500/20 shadow-2xl space-y-6">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#06B6D4]"
                  placeholder="admin@verigen.ai"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">Secret Master Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#06B6D4]"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">MFA Security Token</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={securityToken}
                  onChange={(e) => setSecurityToken(e.target.value)}
                  className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono focus:outline-none focus:border-[#06B6D4]"
                  placeholder="884-291"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#6C63FF] to-[#06B6D4] hover:opacity-90 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-xl shadow-[#6C63FF]/30 mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate Admin Session</span>
                </>
              )}
            </button>
          </form>

          {/* Admin Demo Key Box */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-[#06B6D4] font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Demo Admin Gateway Pass
            </div>
            <p className="text-[11px] text-slate-300">Email: <span className="font-mono text-white">admin@verigen.ai</span></p>
            <p className="text-[11px] text-slate-300">Password: <span className="font-mono text-white">AdminKey#2026</span></p>
            <p className="text-[11px] text-slate-300">Security MFA: <span className="font-mono text-white">884-291</span></p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/login" className="text-xs text-slate-400 hover:text-white transition-colors">
            ← Switch to User / Researcher Login
          </Link>
        </div>
      </div>
    </div>
  );
}

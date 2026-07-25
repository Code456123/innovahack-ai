'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { isValidEmail, isValidPassword } from '@/lib/users';
import { getStoredAccounts, setCurrentUserEmail } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('researcher@verigen.ai');
  const [password, setPassword] = useState('Research#2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // 1. Strict Email Format Validation
    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    // 2. Strict Password Strength Validation
    const passCheck = isValidPassword(password);
    if (!passCheck.valid) {
      setErrorMessage(passCheck.message || 'Password must be at least 8 characters long with letters and numbers.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // 3. Credential Checking against Accounts DB
      const accounts = getStoredAccounts();
      const account = accounts.find(
        (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.passwordHash === password
      );

      if (!account) {
        setIsLoading(false);
        setErrorMessage('Invalid email or password. Please use a valid registered account.');
        return;
      }

      // Set active user session
      setCurrentUserEmail(account.email);
      setIsLoading(false);
      router.push('/dashboard');
    }, 600);
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="aurora-bg">
        <div className="aurora-blob-1" />
        <div className="aurora-blob-2" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#06B6D4] flex items-center justify-center shadow-xl shadow-[#6C63FF]/30 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back to VeriGen AI</h1>
          <p className="text-sm text-slate-400 mt-1">Sign in to access your multi-agent research workspace</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl">
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#6C63FF]"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono font-medium text-slate-300">Password</label>
                <a href="#" className="text-xs text-[#06B6D4] hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass-input rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-[#6C63FF]"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mt-2 shadow-lg shadow-[#6C63FF]/30"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts Selection */}
          <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">Switch User Profiles</div>
            
            <button
              onClick={() => handleQuickLogin('researcher@verigen.ai', 'Research#2026')}
              className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between text-xs transition-colors"
            >
              <div className="text-left">
                <div className="font-semibold text-white">Shivam Chaubey (Researcher)</div>
                <div className="text-[10px] text-slate-400 font-mono">researcher@verigen.ai</div>
              </div>
              <span className="text-[10px] text-[#06B6D4] bg-[#06B6D4]/10 px-2 py-0.5 rounded font-mono">Select</span>
            </button>

            <button
              onClick={() => handleQuickLogin('analyst@verigen.ai', 'Verify#2026')}
              className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between text-xs transition-colors"
            >
              <div className="text-left">
                <div className="font-semibold text-white">Dr. Aris Thorne (Analyst)</div>
                <div className="text-[10px] text-slate-400 font-mono">analyst@verigen.ai</div>
              </div>
              <span className="text-[10px] text-[#6C63FF] bg-[#6C63FF]/10 px-2 py-0.5 rounded font-mono">Select</span>
            </button>
          </div>
        </div>

        <div className="text-center space-y-2 text-xs text-slate-400 mt-6">
          <p>
            Don't have an account?{' '}
            <Link href="/signup" className="text-[#06B6D4] font-semibold hover:underline">
              Create account
            </Link>
          </p>
          <p>
            <Link href="/admin/login" className="text-slate-500 hover:text-rose-400 font-mono text-[11px] transition-colors">
              🔐 Restricted Admin Gateway Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

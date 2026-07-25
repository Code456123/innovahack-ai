'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Eye, EyeOff, Lock, Mail, User, ArrowRight, AlertCircle } from 'lucide-react';
import { isValidEmail, isValidPassword } from '@/lib/users';
import { saveAccount, setCurrentUserEmail } from '@/lib/store';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    // 1. Strict Email Format Validation
    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    // 2. Strict Password Validation
    const passCheck = isValidPassword(password);
    if (!passCheck.valid) {
      setErrorMessage(passCheck.message || 'Password must be at least 8 characters long with letters and numbers.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Create and save new user profile account
      saveAccount({
        email: email.trim(),
        passwordHash: password,
        role: 'Researcher',
        profile: {
          fullName: fullName.trim(),
          username: fullName.toLowerCase().replace(/\s+/g, '_'),
          email: email.trim(),
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
          bio: 'Autonomous AI Multi-Agent Platform Researcher.',
          theme: 'dark',
          language: 'English (US)',
          notifications: { emailAlerts: true, reportComplete: true, weeklyDigest: false },
          defaultMode: 'Deep Research',
        },
      });

      // Set active session
      setCurrentUserEmail(email.trim());
      setIsLoading(false);
      router.push('/dashboard');
    }, 600);
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
          <h1 className="text-2xl font-bold tracking-tight">Create your VeriGen AI Account</h1>
          <p className="text-sm text-slate-400 mt-1">Start fact-verifying research queries with autonomous AI agents</p>
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
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#6C63FF]"
                  placeholder="Dr. Alex Rivera"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#6C63FF]"
                  placeholder="alex@research-lab.org"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass-input rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-[#6C63FF]"
                  placeholder="Minimum 8 characters (letters & numbers)"
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
              <p className="text-[11px] text-slate-500 font-mono mt-1">Must contain at least 8 characters, letters & numbers.</p>
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
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#06B6D4] font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck, Eye, EyeOff, Lock, Mail, User,
  ArrowRight, AlertCircle, Loader2, CheckCircle2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Tab = 'signin' | 'signup';

export default function LoginPage() {
  const router = useRouter();
  const [tab,          setTab]         = useState<Tab>('signin');
  const [fullName,     setFullName]    = useState('');
  const [email,        setEmail]       = useState('');
  const [password,     setPassword]    = useState('');
  const [showPassword, setShowPassword]= useState(false);
  const [isLoading,    setIsLoading]   = useState(false);
  const [googleLoading,setGoogleLoading]= useState(false);
  const [error,        setError]       = useState('');
  const [success,      setSuccess]     = useState('');

  // ── Email / Password Sign-In ──────────────────────────────────────────────
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setError(''); setSuccess('');

    const { error: err } = await supabase.auth.signInWithPassword({ email, password });

    if (err) {
      console.error('[Auth] signIn error:', err.message);
      setError(err.message === 'Invalid login credentials'
        ? 'Email ya password galat hai. Please check karein.'
        : err.message);
      setIsLoading(false);
      return;
    }

    console.log('[Auth] ✅ signed in:', email);
    router.replace('/dashboard');
  };

  // ── Email / Password Sign-Up ──────────────────────────────────────────────
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setError(''); setSuccess('');

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      setIsLoading(false);
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      setIsLoading(false);
      return;
    }

    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName.trim() },
      },
    });

    if (err) {
      console.error('[Auth] signUp error:', err.message);
      setError(err.message.includes('already registered')
        ? 'Ye email already registered hai. Please sign in karein.'
        : err.message);
      setIsLoading(false);
      return;
    }

    // If email confirmation is disabled in Supabase dashboard,
    // session is created immediately and we can redirect
    if (data.session) {
      console.log('[Auth] ✅ signed up & session created:', email);
      router.replace('/dashboard');
      return;
    }

    // Email confirmation required
    console.log('[Auth] signup success — confirmation email sent to:', email);
    setSuccess('Account ban gaya! 🎉 Apna email check karein aur confirm karein. Phir sign in karein.');
    setIsLoading(false);
  };

  // ── Google OAuth ──────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    setGoogleLoading(true); setError('');

    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (err) {
      console.error('[Auth] Google OAuth error:', err.message);
      setError(err.message);
      setGoogleLoading(false);
    }
    // On success, browser is redirected to Google — no further action here
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="aurora-bg">
        <div className="aurora-blob-1" />
        <div className="aurora-blob-2" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#06B6D4] flex items-center justify-center shadow-xl shadow-[#6C63FF]/30 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            {tab === 'signin' ? 'Welcome back to VeriGen AI' : 'Create your VeriGen AI Account'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {tab === 'signin'
              ? 'Sign in to access your multi-agent research workspace'
              : 'Start fact-verifying research with autonomous AI agents'}
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl space-y-5">

          {/* Tab Toggle */}
          <div className="flex rounded-xl bg-white/5 border border-white/10 p-1 gap-1">
            {(['signin', 'signup'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); setSuccess(''); }}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                  tab === t
                    ? 'bg-[#6C63FF] text-white shadow-lg shadow-[#6C63FF]/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Error / Success banners */}
          {error && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={tab === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">

            {/* Full Name — Sign Up only */}
            {tab === 'signup' && (
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
            )}

            {/* Email */}
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

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono font-medium text-slate-300">Password</label>
                {tab === 'signin' && (
                  <span className="text-xs text-[#06B6D4]">&nbsp;</span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass-input rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-[#6C63FF]"
                  placeholder={tab === 'signup' ? 'Min 8 characters' : '••••••••'}
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
              className="w-full btn-primary py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mt-2 shadow-lg shadow-[#6C63FF]/30 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading
                ? <Loader2 className="w-5 h-5 animate-spin" />
                : tab === 'signin'
                  ? <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>
                  : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-slate-500 font-mono">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-5 rounded-2xl bg-white text-gray-800 font-semibold text-sm hover:bg-gray-100 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {googleLoading
              ? <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
              : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              )
            }
            {googleLoading ? 'Redirecting to Google…' : 'Continue with Google'}
          </button>

          <p className="text-center text-xs text-slate-500">
            By continuing, you agree to our terms of service and privacy policy.
          </p>
        </div>

        <div className="text-center mt-6 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition-colors">
            ← Back to landing page
          </Link>
        </div>
      </div>
    </div>
  );
}

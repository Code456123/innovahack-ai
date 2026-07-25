'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Sparkles,
  Zap,
  CheckCircle2,
  FileText,
  Search,
  ArrowRight,
  ChevronDown,
  Layers,
  BarChart2,
  Cpu,
  Lock,
  Globe,
  Star,
  Users,
} from 'lucide-react';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const features = [
    {
      icon: Cpu,
      title: 'Multi-Agent Research Engine',
      description: 'Orchestrates 5 specialized AI agents working concurrently to fetch, synthesize, and validate multi-source literature.',
      color: 'from-[#6C63FF] to-[#8B5CF6]',
    },
    {
      icon: ShieldCheck,
      title: 'Fact Verification & Audit Trail',
      description: 'Cross-checks every statistical assertion against peer-reviewed journals, government archives, and real-time feeds.',
      color: 'from-[#06B6D4] to-[#3B82F6]',
    },
    {
      icon: Layers,
      title: 'Contradiction Detector',
      description: 'Flags discrepancies between conflicting news outlets or research publications with side-by-side claim resolution.',
      color: 'from-[#EC4899] to-[#8B5CF6]',
    },
    {
      icon: BarChart2,
      title: 'Mathematical Confidence Scoring',
      description: 'Provides transparent 0-100% confidence scores derived from source domain authority and claim consensus.',
      color: 'from-[#10B981] to-[#06B6D4]',
    },
    {
      icon: FileText,
      title: 'Citation Generator & Export',
      description: 'Generates publication-ready IEEE, APA, and BibTeX citations with one-click export to PDF, DOCX, and Markdown.',
      color: 'from-[#F59E0B] to-[#EF4444]',
    },
    {
      icon: Lock,
      title: 'Enterprise Lineage Security',
      description: 'Ensures absolute source lineage traceability without hallucinated references or untracked training data.',
      color: 'from-[#6366F1] to-[#A855F7]',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Submit Research Prompt',
      description: 'Enter any research query, upload PDFs, or paste academic URLs to initiate deep multi-agent exploration.',
    },
    {
      step: '02',
      title: 'Agentic Verification Pipeline',
      description: 'Research, Verification, Contradiction, and Citation agents scan millions of data points simultaneously.',
    },
    {
      step: '03',
      title: 'Verified Report Generation',
      description: 'Receive a structured, confidence-backed report complete with citation links and contradiction audits.',
    },
  ];

  const faqs = [
    {
      q: 'How does VeriGen AI eliminate AI hallucinations?',
      a: 'VeriGen AI uses a dedicated Verification Agent that forces every generated claim to map directly to an verified URL citation. If a claim lacks verifiable source consensus, its confidence score drops and it is explicitly flagged.',
    },
    {
      q: 'What is the difference between Deep Research and Fast Mode?',
      a: 'Fast Mode performs quick web & news synthesis in ~30 seconds. Deep Research engages all 5 autonomous agents to analyze academic whitepapers, PDF uploads, and historical data registers for ~2-3 minutes.',
    },
    {
      q: 'Can I integrate my backend or API keys?',
      a: 'Yes! VeriGen AI is built frontend-first with clean REST API integration points ready for Supabase database layer and Lyzr AI Agents.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-[#6C63FF] selection:text-white relative overflow-hidden">
      {/* Aurora Background Blobs */}
      <div className="aurora-bg">
        <div className="aurora-blob-1" />
        <div className="aurora-blob-2" />
      </div>

      {/* Navigation Navbar */}
      <nav className="relative z-20 border-b border-white/10 bg-[#030712]/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#06B6D4] flex items-center justify-center shadow-lg shadow-[#6C63FF]/40">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight">VeriGen</span>
            <span className="ml-1.5 text-xs font-mono font-bold text-[#06B6D4] bg-[#06B6D4]/10 border border-[#06B6D4]/30 px-2 py-0.5 rounded-full">
              AI
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-slate-300 font-medium">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/dashboard"
            className="btn-primary px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
          >
            Launch Platform <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-6 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#6C63FF]/20 to-[#06B6D4]/20 border border-[#6C63FF]/40 text-xs font-mono text-[#A5B4FC] mb-8">
          <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />
          <span>Next-Gen Autonomous Multi-Agent Fact Verification</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
          Research Smarter.{' '}
          <span className="text-gradient">Verify Everything.</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Deploy specialized AI agents to research topics, verify statistical claims, detect contradictions, and synthesize citation-backed report dossiers.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/research"
            className="w-full sm:w-auto btn-primary px-8 py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-3 shadow-xl"
          >
            <Zap className="w-5 h-5" /> Start Researching Free
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto btn-secondary px-8 py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-2"
          >
            Explore Dashboard
          </Link>
        </div>

        {/* Hero Interactive Agent Graph Preview */}
        <div className="mt-16 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden max-w-4xl mx-auto">
          <div className="text-xs font-mono text-[#06B6D4] uppercase tracking-widest mb-4">
            Autonomous Multi-Agent Architecture
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { name: 'Research Agent', role: 'Data Mining', icon: Search, color: 'text-indigo-400' },
              { name: 'Verification Agent', role: 'Fact Auditing', icon: ShieldCheck, color: 'text-cyan-400' },
              { name: 'Contradiction Detector', role: 'Conflict Analysis', icon: Layers, color: 'text-pink-400' },
              { name: 'Citation Generator', role: 'Academic Formatter', icon: FileText, color: 'text-amber-400' },
              { name: 'Report Builder', role: 'Dossier Synthesis', icon: CheckCircle2, color: 'text-emerald-400' },
            ].map((agent, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-[#111827]/80 border border-white/10 hover:border-[#6C63FF]/50 transition-all text-center group"
              >
                <agent.icon className={`w-6 h-6 mx-auto mb-2 ${agent.color} group-hover:scale-110 transition-transform`} />
                <div className="text-xs font-semibold text-white">{agent.name}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{agent.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="relative z-10 py-12 border-y border-white/10 bg-[#070C18]/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white">100K+</div>
            <div className="text-xs text-slate-400 font-mono mt-1">Verified Reports</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#06B6D4]">98.4%</div>
            <div className="text-xs text-slate-400 font-mono mt-1">Verification Accuracy</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#6C63FF]">4 Agents</div>
            <div className="text-xs text-slate-400 font-mono mt-1">Parallel Execution</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">&lt; 3 Min</div>
            <div className="text-xs text-slate-400 font-mono mt-1">Avg Research Time</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-mono text-[#6C63FF] uppercase tracking-widest mb-2">Engineered for Accuracy</div>
          <h2 className="text-3xl sm:text-4xl font-bold">Built for Researchers, Journalists & Engineers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-5 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feat.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feat.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="relative z-10 py-20 px-6 max-w-5xl mx-auto border-t border-white/10">
        <div className="text-center max-w-xl mx-auto mb-16">
          <div className="text-xs font-mono text-[#06B6D4] uppercase tracking-widest mb-2">Simple 3-Step Flow</div>
          <h2 className="text-3xl sm:text-4xl font-bold">From Prompt to Verified Dossier</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl relative">
              <div className="text-3xl font-extrabold font-mono text-[#6C63FF]/50 mb-3">{s.step}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative z-10 py-20 px-6 max-w-4xl mx-auto border-t border-white/10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-panel rounded-2xl overflow-hidden border border-white/10">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between text-base font-medium text-white hover:bg-white/5 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-[#06B6D4]' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="p-5 pt-0 text-sm text-slate-300 leading-relaxed border-t border-white/5">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#02050E] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400 text-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#6C63FF]" />
            <span className="font-bold text-white">VeriGen AI</span>
            <span className="text-xs text-slate-500 ml-2">© 2026 VeriGen AI Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 font-medium text-xs">
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="/research" className="hover:text-white transition-colors">New Research</Link>
            <Link href="/history" className="hover:text-white transition-colors">History</Link>
            <Link href="/settings" className="hover:text-white transition-colors">Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

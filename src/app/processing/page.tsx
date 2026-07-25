'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Search,
  Layers,
  Sparkles,
  ArrowRight,
  XCircle,
  Cpu,
} from 'lucide-react';

function ProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = searchParams.get('id') || 'rep-001';
  const query = searchParams.get('q') || 'Impact of AI in Healthcare & Clinical Diagnostics 2026';

  const [mobileOpen, setMobileOpen] = useState(false);
  const [progress, setProgress] = useState(15);
  const [activeStep, setActiveStep] = useState(0);

  // Real 4-agent pipeline (matches route.ts)
  const agents = [
    { name: 'Research Agent',         role: 'Mining primary sources & academic archives', icon: Search },
    { name: 'Verification Agent',     role: 'Cross-checking statistical assertions',       icon: ShieldCheck },
    { name: 'Contradiction Detector', role: 'Auditing source discrepancies',               icon: Layers },
    { name: 'Synthesis Agent',        role: 'Synthesizing final dossier & confidence score', icon: Sparkles },
  ];

  // Cosmetic progress bar — real API call already completed before this page mounted.
  // 4 steps, one per real agent, ~1s each. Auto-redirect when done.
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const next = prev + 25; // 4 steps of 25%
        if (next > 25  && next <= 50)  setActiveStep(1);
        else if (next > 50  && next <= 75)  setActiveStep(2);
        else if (next > 75)               setActiveStep(3);
        return next > 100 ? 100 : next;
      });
    }, 900);

    return () => clearInterval(timer);
  }, []);

  // Auto-navigate to report when cosmetic progress finishes
  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => router.push(`/report?id=${reportId}`), 500);
      return () => clearTimeout(t);
    }
  }, [progress, reportId, router]);

  return (
    <div className="min-h-screen bg-[#030712] text-white flex">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-8 flex flex-col justify-center">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6C63FF]/20 border border-[#6C63FF]/40 text-xs font-mono text-[#A5B4FC]">
              <Cpu className="w-4 h-4 text-[#06B6D4] animate-spin" /> Autonomous Multi-Agent Pipeline Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight max-w-2xl mx-auto">
              Synthesizing & Fact-Verifying:
            </h1>
            <p className="text-base text-[#06B6D4] font-medium max-w-xl mx-auto line-clamp-2">
              "{query}"
            </p>
          </div>

          {/* Progress Bar Container */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Pipeline Execution Progress</span>
                <span className="text-[#06B6D4] font-bold">{progress}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden relative p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] via-[#8B5CF6] to-[#06B6D4] transition-all duration-500 shadow-md shadow-[#6C63FF]/50"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Live Agent Cards List */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              {agents.map((agent, idx) => {
                const Icon = agent.icon;
                const isCompleted = idx < activeStep || progress === 100;
                const isRunning = idx === activeStep && progress < 100;
                const isPending = idx > activeStep && progress < 100;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                      isCompleted
                        ? 'bg-[#06B6D4]/10 border-[#06B6D4]/40 text-white'
                        : isRunning
                        ? 'bg-[#6C63FF]/20 border-[#6C63FF] shadow-lg shadow-[#6C63FF]/20 animate-pulse'
                        : 'bg-white/5 border-white/5 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isCompleted
                            ? 'bg-[#06B6D4]/20 text-[#06B6D4]'
                            : isRunning
                            ? 'bg-[#6C63FF]/30 text-[#A5B4FC]'
                            : 'bg-white/5 text-slate-500'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate">{agent.name}</div>
                        <div className="text-xs text-slate-400 truncate">{agent.role}</div>
                      </div>
                    </div>

                    <div className="shrink-0 font-mono text-xs">
                      {isCompleted && (
                        <span className="flex items-center gap-1 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-4 h-4" /> Complete
                        </span>
                      )}
                      {isRunning && (
                        <span className="flex items-center gap-1.5 text-[#A5B4FC]">
                          <div className="w-2 h-2 rounded-full bg-[#6C63FF] animate-ping" /> Running...
                        </span>
                      )}
                      {isPending && <span className="text-slate-600">Pending</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => router.push('/research')}
                className="btn-secondary px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4 text-rose-400" /> Cancel Research
              </button>

              <button
                onClick={() => router.push(`/report?id=${reportId}`)}
                disabled={progress < 100}
                className={`px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  progress === 100
                    ? 'btn-primary shadow-lg'
                    : 'bg-white/10 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>View Verified Report</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ProcessingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Initializing Agent Pipeline...</div>}>
      <ProcessingContent />
    </Suspense>
  );
}

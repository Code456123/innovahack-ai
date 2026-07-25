'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { ProtectedPage } from '@/components/ProtectedPage';
import {
  Sparkles,
  Search,
  CheckCircle2,
  TrendingUp,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  Bookmark,
  Trash2,
  ExternalLink,
  Layers,
  Zap,
  Filter,
  Flame,
} from 'lucide-react';
import { getStoredReports, toggleSaveReportStore, deleteReportFromStore } from '@/lib/store';
import { ResearchReport } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [reports, setReports] = useState<ResearchReport[]>([]);
  const [quickQuery, setQuickQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'High Confidence' | 'Saved'>('All');

  const loadReports = () => {
    setReports(getStoredReports());
  };

  useEffect(() => {
    loadReports();
    window.addEventListener('verigen_reports_updated', loadReports);
    return () => window.removeEventListener('verigen_reports_updated', loadReports);
  }, []);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      router.push(`/research?q=${encodeURIComponent(quickQuery.trim())}`);
    }
  };

  const handleToggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveReportStore(id);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteReportFromStore(id);
  };

  const filteredReports = reports.filter((r) => {
    if (selectedFilter === 'High Confidence') return r.confidence >= 90;
    if (selectedFilter === 'Saved') return r.saved;
    return true;
  });

  // Calculate statistics dynamically
  const totalSearches = reports.length;
  const avgConfidence = reports.length
    ? Math.round(reports.reduce((acc, curr) => acc + curr.confidence, 0) / reports.length)
    : 0;
  const savedCount = reports.filter((r) => r.saved).length;

  return (
    <ProtectedPage>
    <div className="min-h-screen bg-[#030712] text-white flex">
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Welcome Banner & Quick Research */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden">
            <div className="aurora-bg opacity-40">
              <div className="aurora-blob-1" />
            </div>

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6C63FF]/20 border border-[#6C63FF]/40 text-xs font-mono text-[#A5B4FC] mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" /> Autonomous Agent Workspace Ready
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Welcome back, <span className="text-gradient">Researcher</span>
              </h1>
              <p className="text-sm text-slate-300 mt-1">
                Enter any scientific topic or claim to deploy 4 sequential research & verification agents.
              </p>

              {/* Quick Search Box */}
              <form onSubmit={handleQuickSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={quickQuery}
                    onChange={(e) => setQuickQuery(e.target.value)}
                    placeholder="e.g. Impact of AI on Clinical Diagnostics, Quantum Key Distribution..."
                    className="w-full glass-input rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#6C63FF]"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary px-6 py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shrink-0"
                >
                  <Zap className="w-4 h-4" /> Start Research
                </button>
              </form>
            </div>
          </div>

          {/* Key Metrics Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-mono">Total Researches</span>
                <Search className="w-4 h-4 text-[#6C63FF]" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold">{totalSearches}</div>
              <p className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +12% this week
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-mono">Avg Confidence</span>
                <ShieldCheck className="w-4 h-4 text-[#06B6D4]" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#06B6D4]">{avgConfidence}%</div>
              <p className="text-[11px] text-slate-400 font-mono mt-1">Cross-source consensus</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-mono">Bookmarked Dossiers</span>
                <Bookmark className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold">{savedCount}</div>
              <p className="text-[11px] text-slate-400 font-mono mt-1">Saved for export</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-mono">Active Agents</span>
                <Layers className="w-4 h-4 text-[#EC4899]" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white">4/4</div>
              <p className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> All systems online
              </p>
            </div>
          </div>

          {/* Recent Reports Table & Trending Topics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Reports Section (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#6C63FF]" /> Recent Research Reports
                </h2>

                {/* Filter Chips */}
                <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
                  {(['All', 'High Confidence', 'Saved'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        selectedFilter === filter
                          ? 'bg-[#6C63FF] text-white font-medium'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredReports.length === 0 ? (
                  <div className="glass-panel p-8 text-center rounded-2xl text-slate-400 text-sm">
                    No research reports match your filter criteria.
                  </div>
                ) : (
                  filteredReports.map((report) => (
                    <div
                      key={report.id}
                      onClick={() => router.push(`/report?id=${report.id}`)}
                      className="glass-panel glass-panel-hover p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md ${
                              report.mode === 'Deep Research'
                                ? 'bg-[#6C63FF]/20 text-[#A5B4FC] border border-[#6C63FF]/30'
                                : 'bg-[#06B6D4]/20 text-[#67E8F9] border border-[#06B6D4]/30'
                            }`}
                          >
                            {report.mode}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">{report.date}</span>
                        </div>
                        <h3 className="font-semibold text-sm text-white group-hover:text-[#06B6D4] transition-colors truncate">
                          {report.query}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-1">{report.summary}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        <div className="text-right">
                          <div className="text-xs font-bold text-[#06B6D4]">{report.confidence}%</div>
                          <div className="text-[9px] text-slate-500 font-mono">Confidence</div>
                        </div>

                        <button
                          onClick={(e) => handleToggleSave(report.id, e)}
                          className={`p-2 rounded-xl border transition-colors ${
                            report.saved
                              ? 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40'
                              : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                          }`}
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>

                        <button
                          onClick={(e) => handleDelete(report.id, e)}
                          className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Trending Topics Panel (1 Col) */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#F59E0B]" /> Trending AI Research Topics
              </h2>

              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
                {[
                  { title: 'AI in Healthcare & Clinical Diagnostics', category: 'Biomedical', count: '1,420 searches' },
                  { title: 'Quantum Encryption & Post-Quantum Cryptography', category: 'Cybersecurity', count: '980 searches' },
                  { title: 'Semiconductor Foundry Supply Resilience', category: 'Hardware', count: '850 searches' },
                  { title: 'Agentic LLM Safety & Hallucination Audits', category: 'AI Safety', count: '740 searches' },
                ].map((topic, i) => (
                  <div
                    key={i}
                    onClick={() => router.push(`/research?q=${encodeURIComponent(topic.title)}`)}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#6C63FF]/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                      <span className="text-[#06B6D4]">{topic.category}</span>
                      <span>{topic.count}</span>
                    </div>
                    <div className="text-xs font-medium text-white group-hover:text-[#A5B4FC] transition-colors">
                      {topic.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    </ProtectedPage>
  );
}

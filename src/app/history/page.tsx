'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import {
  History as HistoryIcon,
  Search,
  Trash2,
  Bookmark,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Clock,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { getStoredReports, deleteReportFromStore, clearAllReportsStore, toggleSaveReportStore } from '@/lib/store';
import { ResearchReport } from '@/types';

export default function HistoryPage() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [reports, setReports] = useState<ResearchReport[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [activeChip, setActiveChip] = useState<'All' | 'Deep Research' | 'Fast Mode' | 'High Confidence'>('All');
  const [showClearModal, setShowClearModal] = useState(false);

  const loadReports = () => {
    setReports(getStoredReports());
  };

  useEffect(() => {
    loadReports();
    window.addEventListener('verigen_reports_updated', loadReports);
    return () => window.removeEventListener('verigen_reports_updated', loadReports);
  }, []);

  const handleDeleteOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteReportFromStore(id);
  };

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveReportStore(id);
  };

  const handleClearAll = () => {
    clearAllReportsStore();
    setShowClearModal(false);
  };

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.query.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.summary.toLowerCase().includes(searchFilter.toLowerCase());

    if (!matchesSearch) return false;
    if (activeChip === 'Deep Research') return r.mode === 'Deep Research';
    if (activeChip === 'Fast Mode') return r.mode === 'Fast Mode';
    if (activeChip === 'High Confidence') return r.confidence >= 90;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#030712] text-white flex">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <HistoryIcon className="w-6 h-6 text-[#6C63FF]" /> Research History Log
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Persistent local record of all multi-agent research executions and fact checks.
              </p>
            </div>

            {reports.length > 0 && (
              <button
                onClick={() => setShowClearModal(true)}
                className="btn-secondary px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Trash2 className="w-4 h-4" /> Clear All History
              </button>
            )}
          </div>

          {/* Search & Filter Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter history items..."
                className="w-full glass-input rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-[#6C63FF]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {(['All', 'Deep Research', 'Fast Mode', 'High Confidence'] as const).map((chip) => (
                <button
                  key={chip}
                  onClick={() => setActiveChip(chip)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    activeChip === chip
                      ? 'bg-[#6C63FF] text-white'
                      : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* History Cards List */}
          <div className="space-y-3">
            {filteredReports.length === 0 ? (
              <div className="glass-panel p-12 text-center rounded-3xl text-slate-400 text-sm space-y-3">
                <HistoryIcon className="w-10 h-10 text-slate-600 mx-auto" />
                <p>No research history entries found matching your query.</p>
              </div>
            ) : (
              filteredReports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => router.push(`/report?id=${report.id}`)}
                  className="glass-panel glass-panel-hover p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#6C63FF]/20 text-[#A5B4FC]">
                        {report.mode}
                      </span>
                      <span className="text-[10px] font-mono text-[#06B6D4] bg-[#06B6D4]/10 px-2 py-0.5 rounded">
                        {report.verificationLevel}
                      </span>
                      <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {report.date}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-white group-hover:text-[#06B6D4] transition-colors truncate">
                      {report.query}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{report.summary}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-[#06B6D4] font-mono">{report.confidence}%</div>
                      <div className="text-[9px] text-slate-500 font-mono">Consensus</div>
                    </div>

                    <button
                      onClick={(e) => handleToggleBookmark(report.id, e)}
                      className={`p-2 rounded-xl border transition-colors ${
                        report.saved
                          ? 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40'
                          : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => handleDeleteOne(report.id, e)}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Clear All Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-3xl max-w-sm w-full border border-white/10 space-y-4 text-center">
            <Trash2 className="w-10 h-10 text-rose-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Clear All Research History?</h3>
            <p className="text-xs text-slate-400">
              This action will delete all stored research history entries from your browser's local storage.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowClearModal(false)}
                className="w-full btn-secondary py-2 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 rounded-xl text-xs"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

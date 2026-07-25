'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import {
  Bookmark,
  Search,
  Grid,
  List,
  Folder,
  Tag,
  ArrowUpRight,
  Trash2,
  FileText,
  Download,
} from 'lucide-react';
import { getStoredReports, toggleSaveReportStore } from '@/lib/store';
import { ResearchReport } from '@/types';

export default function SavedReportsPage() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [reports, setReports] = useState<ResearchReport[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const loadReports = () => {
    const all = getStoredReports();
    setReports(all.filter((r) => r.saved));
  };

  useEffect(() => {
    loadReports();
    window.addEventListener('verigen_reports_updated', loadReports);
    return () => window.removeEventListener('verigen_reports_updated', loadReports);
  }, []);

  const handleRemoveSaved = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveReportStore(id);
  };

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.query.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.summary.toLowerCase().includes(searchFilter.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedTag !== 'All') return r.tags.includes(selectedTag);
    return true;
  });

  const tagsList = ['All', 'Healthcare', 'Cybersecurity', 'Semiconductors', 'AI & ML'];

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
                <Bookmark className="w-6 h-6 text-[#F59E0B]" /> Saved Research Reports
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Your bookmarked research dossiers ready for PDF export or sharing.
              </p>
            </div>

            {/* View Mode & Search */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-[#6C63FF] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-[#6C63FF] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Search & Tag Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search saved reports..."
                className="w-full glass-input rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-[#6C63FF]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {tagsList.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
                    selectedTag === tag
                      ? 'bg-[#06B6D4] text-black font-bold'
                      : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Saved Reports View */}
          {filteredReports.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-3xl text-slate-400 text-sm space-y-3">
              <Folder className="w-10 h-10 text-slate-600 mx-auto" />
              <p>No saved reports found. Click the bookmark icon on any research report to save it here.</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => router.push(`/report?id=${report.id}`)}
                  className="glass-panel glass-panel-hover p-5 rounded-2xl border border-white/10 flex flex-col justify-between cursor-pointer group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#06B6D4] bg-[#06B6D4]/10 px-2 py-0.5 rounded border border-[#06B6D4]/30">
                        {report.mode}
                      </span>
                      <span className="text-xs font-bold text-emerald-400 font-mono">{report.confidence}% Match</span>
                    </div>

                    <h3 className="font-bold text-sm text-white group-hover:text-[#6C63FF] transition-colors line-clamp-2">
                      {report.query}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{report.summary}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono">{report.date}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleRemoveSaved(report.id, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => router.push(`/report?id=${report.id}`)}
                  className="glass-panel glass-panel-hover p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#06B6D4]">{report.mode}</span>
                      <span className="text-xs text-slate-500 font-mono">{report.date}</span>
                    </div>
                    <h3 className="font-semibold text-sm text-white group-hover:text-[#6C63FF] truncate">
                      {report.query}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-bold text-emerald-400 font-mono">{report.confidence}%</span>
                    <button
                      onClick={(e) => handleRemoveSaved(report.id, e)}
                      className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

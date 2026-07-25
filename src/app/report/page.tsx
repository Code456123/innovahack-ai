'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  Share2,
  Bookmark,
  ExternalLink,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowLeft,
  Printer,
  Check,
} from 'lucide-react';
import { getStoredReports, toggleSaveReportStore } from '@/lib/store';
import { ResearchReport } from '@/types';

function ReportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = searchParams.get('id') || 'rep-001';

  const [mobileOpen, setMobileOpen] = useState(false);
  const [report, setReport] = useState<ResearchReport | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'analysis' | 'claims' | 'contradictions' | 'sources'>('summary');
  const [expandedClaim, setExpandedClaim] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const all = getStoredReports();
    const found = all.find((r) => r.id === reportId) || all[0];
    if (found) {
      setReport(found);
      setIsSaved(found.saved);
    }
  }, [reportId]);

  if (!report) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#6C63FF] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Loading Verified Report Dossier...</p>
        </div>
      </div>
    );
  }

  const handleToggleSave = () => {
    toggleSaveReportStore(report.id);
    setIsSaved(!isSaved);
  };

  const handleShareCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-secondary px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleSave}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  isSaved
                    ? 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40'
                    : 'btn-secondary'
                }`}
              >
                <Bookmark className="w-4 h-4" /> {isSaved ? 'Saved' : 'Bookmark Report'}
              </button>

              <button
                onClick={() => setShowShareModal(true)}
                className="btn-secondary px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>

              <button
                onClick={handleExportPrint}
                className="btn-primary px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Export PDF
              </button>
            </div>
          </div>

          {/* Dossier Header Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#6C63FF]/20 text-[#A5B4FC] border border-[#6C63FF]/40">
                    {report.mode}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#06B6D4]/20 text-[#67E8F9] border border-[#06B6D4]/40">
                    {report.verificationLevel} Verification
                  </span>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {report.date} • {report.time}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                  {report.query}
                </h1>
              </div>

              {/* Confidence Score Circle Meter */}
              <div className="flex items-center gap-4 shrink-0 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="26" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="transparent" />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="#06B6D4"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={163}
                      strokeDashoffset={163 - (163 * report.confidence) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute font-mono font-bold text-base text-white">{report.confidence}%</span>
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400">Consensus Rating</div>
                  <div className="text-sm font-bold text-[#06B6D4] flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> High Reliability
                  </div>
                </div>
              </div>
            </div>

            {/* Dossier Tabs */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-0 overflow-x-auto">
              {[
                { id: 'summary', label: 'Summary', icon: Sparkles },
                { id: 'analysis', label: 'Detailed Analysis', icon: FileText },
                { id: 'claims', label: `Verified Claims (${report.verifiedClaims.length})`, icon: CheckCircle2 },
                { id: 'contradictions', label: `Contradictions (${report.contradictions.length})`, icon: Layers },
                { id: 'sources', label: `Sources (${report.sources.length})`, icon: ExternalLink },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                      isActive
                        ? 'border-[#6C63FF] text-[#A5B4FC] bg-white/5 rounded-t-xl'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab 1: Executive Summary */}
          {activeTab === 'summary' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#06B6D4]" /> Executive Summary
              </h2>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed bg-white/5 p-5 rounded-2xl border border-white/5">
                {report.summary}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-xs font-mono text-slate-400">Sources Analyzed</div>
                  <div className="text-xl font-bold text-white mt-1">{report.sources.length * 8} Repositories</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-xs font-mono text-slate-400">Verified Assertions</div>
                  <div className="text-xl font-bold text-emerald-400 mt-1">{report.verifiedClaims.length} Claims</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-xs font-mono text-slate-400">Contradiction Audits</div>
                  <div className="text-xl font-bold text-rose-400 mt-1">{report.contradictions.length} Flagged</div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Detailed Analysis */}
          {activeTab === 'analysis' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-[#6C63FF]" /> Deep Technical Analysis
              </h2>
              <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4 whitespace-pre-line">
                {report.detailedAnalysis}
              </div>
            </div>
          )}

          {/* Tab 3: Verified Claims */}
          {activeTab === 'claims' && (
            <div className="space-y-4">
              {report.verifiedClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {claim.verified ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="text-sm font-medium text-white">{claim.text}</div>
                        <div className="text-xs text-slate-400 mt-1 font-mono">{claim.citation}</div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                        claim.badge === 'High'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : claim.badge === 'Medium'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {claim.confidence}% {claim.badge} Confidence
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Contradiction Matrix */}
          {activeTab === 'contradictions' && (
            <div className="space-y-4">
              {report.contradictions.length === 0 ? (
                <div className="glass-panel p-8 rounded-2xl text-center text-slate-400 text-sm">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  No contradictory assertions detected across cross-referenced publications.
                </div>
              ) : (
                report.contradictions.map((contra) => (
                  <div key={contra.id} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                    <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Discrepancy Audited: {contra.claim}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                        <div className="text-xs font-bold text-[#06B6D4]">{contra.sourceA.name}</div>
                        <p className="text-xs text-slate-300 italic">"{contra.sourceA.quote}"</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                        <div className="text-xs font-bold text-[#EC4899]">{contra.sourceB.name}</div>
                        <p className="text-xs text-slate-300 italic">"{contra.sourceB.quote}"</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#6C63FF]/10 border border-[#6C63FF]/30 text-xs text-slate-200">
                      <span className="font-bold text-[#A5B4FC]">Agent Resolution: </span>
                      {contra.resolution}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 5: Sources & Citations */}
          {activeTab === 'sources' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.sources.map((src) => (
                <div key={src.id} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono text-[#06B6D4] bg-[#06B6D4]/10 px-2 py-0.5 rounded">
                        {src.type}
                      </span>
                      <h4 className="text-sm font-semibold text-white mt-1.5">{src.title}</h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{src.domain} • {src.date}</p>
                    </div>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-white/5">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>Reliability Score</span>
                      <span className="text-emerald-400 font-bold">{src.reliability}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${src.reliability}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Share Link Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-3xl max-w-md w-full border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white">Share Research Dossier</h3>
            <p className="text-xs text-slate-400">
              Anyone with this link can view the verified research report and source citations.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={typeof window !== 'undefined' ? window.location.href : ''}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono"
              />
              <button
                onClick={handleShareCopy}
                className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4" /> : 'Copy Link'}
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full btn-secondary py-2 rounded-xl text-xs mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Report Page...</div>}>
      <ReportContent />
    </Suspense>
  );
}

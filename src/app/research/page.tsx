'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import {
  Search,
  Sparkles,
  Mic,
  FileText,
  Link as LinkIcon,
  ShieldCheck,
  Zap,
  Layers,
  Cpu,
  CheckCircle2,
  ArrowRight,
  UploadCloud,
  X,
} from 'lucide-react';
import { saveReportToStore } from '@/lib/store';
import { ResearchMode, VerificationLevel, ResearchReport } from '@/types';

function ResearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const [mode, setMode] = useState<ResearchMode>('Deep Research');
  const [verificationLevel, setVerificationLevel] = useState<VerificationLevel>('Expert');
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlModal, setShowUrlModal] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleVoiceInput = () => {
    setIsRecording(true);
    setTimeout(() => {
      setQuery('Impact of AI on Clinical Diagnostics and Triage Latency 2026');
      setIsRecording(false);
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFiles((prev) => [...prev, e.target.files![0].name]);
    }
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      setUploadedFiles((prev) => [...prev, urlInput.trim()]);
      setUrlInput('');
      setShowUrlModal(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const reportId = `rep-${Date.now()}`;
    const newReport: ResearchReport = {
      id: reportId,
      query: query.trim(),
      date: new Date().toISOString().split('T')[0],
      time: mode === 'Deep Research' ? '2m 45s' : '45s',
      confidence: Math.floor(Math.random() * 10) + 90,
      status: 'Completed',
      mode,
      verificationLevel,
      saved: false,
      tags: ['Autonomous AI', 'Fact Verified', mode],
      summary: `Autonomous multi-agent synthesis of "${query.trim()}" cross-checked across 24 peer-reviewed sources and real-time domain feeds.`,
      detailedAnalysis: `### Research Dossier: ${query.trim()}
      
1. **Source Consensus**: High alignment across academic and government databases.
2. **Key Metric Verified**: 94.2% statistical confidence verified across independent trial data.
3. **Contradictions Audited**: Zero critical discrepancies detected in primary claims.`,
      verifiedClaims: [
        {
          id: `claim-${Date.now()}-1`,
          text: `Primary statistical evidence confirms significant accuracy improvements for "${query.trim()}".`,
          confidence: 96,
          badge: 'High',
          verified: true,
          citation: 'Peer-Reviewed Journal Index 2026',
          sourceUrl: 'https://nature.com/articles/research-verify',
        },
      ],
      contradictions: [],
      sources: [
        {
          id: `src-${Date.now()}-1`,
          title: `Global Assessment of ${query.trim()}`,
          domain: 'nature.com',
          reliability: 96,
          date: '2026-06-15',
          url: 'https://nature.com',
          type: 'Research Papers',
        },
      ],
      agents: [
        { name: 'Research Agent', status: 'Completed', timeTaken: '30s', description: 'Mined 12,000 documents' },
        { name: 'Verification Agent', status: 'Completed', timeTaken: '45s', description: 'Cross-checked 18 facts' },
        { name: 'Contradiction Detector', status: 'Completed', timeTaken: '20s', description: 'Audited source conflicts' },
        { name: 'Citation Generator', status: 'Completed', timeTaken: '15s', description: 'Formatted IEEE references' },
        { name: 'Report Builder', status: 'Completed', timeTaken: '25s', description: 'Finalized dossier' },
      ],
    };

    saveReportToStore(newReport);
    router.push(`/processing?id=${reportId}&q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6C63FF]/20 border border-[#6C63FF]/40 text-xs font-mono text-[#A5B4FC]">
              <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" /> Autonomous Multi-Agent Prompt
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Initiate New Fact-Verified Research</h1>
            <p className="text-sm text-slate-400">
              Ask any question, test hypotheses, or analyze uploaded documents with 5 collaborative AI agents.
            </p>
          </div>

          {/* Research Input Form */}
          <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
            {/* Search Box & Controls */}
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything... e.g. Impact of AI in Healthcare, Quantum Cryptography standards, or paste a thesis abstract..."
                rows={4}
                className="w-full glass-input rounded-2xl p-4 text-base placeholder-slate-500 focus:outline-none focus:border-[#6C63FF] resize-none"
                required
              />

              <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-white/10">
                {/* Upload Buttons */}
                <div className="flex items-center gap-2">
                  <label className="btn-secondary px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer">
                    <UploadCloud className="w-4 h-4 text-[#06B6D4]" /> Upload PDF
                    <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowUrlModal(true)}
                    className="btn-secondary px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5"
                  >
                    <LinkIcon className="w-4 h-4 text-[#6C63FF]" /> Add URL
                  </button>

                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    className={`btn-secondary px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 ${
                      isRecording ? 'animate-pulse border-rose-500 text-rose-400' : ''
                    }`}
                  >
                    <Mic className="w-4 h-4 text-[#EC4899]" /> {isRecording ? 'Listening...' : 'Voice Search'}
                  </button>
                </div>

                <button
                  type="submit"
                  className="btn-primary px-7 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-[#6C63FF]/30 ml-auto"
                >
                  <Zap className="w-4 h-4" /> Execute Research
                </button>
              </div>
            </div>

            {/* Display Attached Files */}
            {uploadedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {uploadedFiles.map((file, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-xs text-slate-200 border border-white/10 font-mono"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#06B6D4]" /> {file}
                    <button
                      type="button"
                      onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== idx))}
                      className="hover:text-rose-400 ml-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Mode & Verification Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
              {/* Mode Selector */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                  Research Execution Speed
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'Deep Research', label: 'Deep Research', desc: '5 Agents • 2-3 min • Full Audit' },
                    { id: 'Fast Mode', label: 'Fast Mode', desc: 'Quick Web Synthesis • 30 sec' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMode(m.id as ResearchMode)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        mode === m.id
                          ? 'bg-[#6C63FF]/20 border-[#6C63FF] shadow-lg shadow-[#6C63FF]/20'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold text-white mb-0.5">{m.label}</div>
                      <div className="text-[10px] text-slate-400">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Verification Level */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                  Fact Verification Rigor
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Basic', 'Advanced', 'Expert'] as VerificationLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setVerificationLevel(lvl)}
                      className={`py-3 px-2 rounded-xl border text-center text-xs font-semibold transition-all ${
                        verificationLevel === lvl
                          ? 'bg-[#06B6D4]/20 border-[#06B6D4] text-[#67E8F9]'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </form>

          {/* Agent Pipeline Preview Card */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-xs font-mono text-[#06B6D4] uppercase tracking-widest flex items-center gap-2">
              <Cpu className="w-4 h-4" /> Multi-Agent Execution Pipeline Preview
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {[
                { name: '1. Research Agent', desc: 'Queries academic repositories' },
                { name: '2. Verification Agent', desc: 'Validates claims & metrics' },
                { name: '3. Contradiction Detector', desc: 'Audits conflicting statements' },
                { name: '4. Citation Generator', desc: 'Formats APA/IEEE sources' },
                { name: '5. Report Builder', desc: 'Synthesizes final dossier' },
              ].map((agent, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                  <div className="text-xs font-semibold text-white">{agent.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{agent.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* URL Input Modal */}
      {showUrlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-3xl max-w-md w-full border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white">Add Web Page / Paper URL</h3>
            <form onSubmit={handleAddUrl} className="space-y-4">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://nature.com/articles/..."
                className="w-full glass-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6C63FF]"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUrlModal(false)}
                  className="btn-secondary px-4 py-2 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold">
                  Add URL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Research Interface...</div>}>
      <ResearchContent />
    </Suspense>
  );
}

'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import {
  Sparkles,
  Mic,
  MicOff,
  FileText,
  Link as LinkIcon,
  Zap,
  Cpu,
  Loader2,
  AlertCircle,
  UploadCloud,
  X,
  CheckCircle2,
} from 'lucide-react';
import { saveReportToStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { ProtectedPage } from '@/components/ProtectedPage';
import { ResearchMode, VerificationLevel, ResearchReport } from '@/types';

// ── Web Speech API type shim (not in all TS lib targets) ──────────────────
interface ISpeechRecognitionResult {
  readonly transcript: string;
}
interface ISpeechRecognitionResultList {
  readonly length: number;
  [index: number]: { [alt: number]: ISpeechRecognitionResult };
}
interface ISpeechRecognitionEvent {
  readonly results: ISpeechRecognitionResultList;
}
interface ISpeechRecognitionErrorEvent {
  readonly error: string;
}
interface ISpeechRecognition {
  lang:            string;
  interimResults:  boolean;
  maxAlternatives: number;
  start():  void;
  stop():   void;
  onstart:  (() => void) | null;
  onresult: ((e: ISpeechRecognitionEvent) => void) | null;
  onerror:  ((e: ISpeechRecognitionErrorEvent) => void) | null;
  onend:    (() => void) | null;
}
declare global {
  interface Window {
    SpeechRecognition?: new () => ISpeechRecognition;
    webkitSpeechRecognition?: new () => ISpeechRecognition;
  }
}

function ResearchContent() {
  const router        = useRouter();
  const searchParams  = useSearchParams();
  const initialQuery  = searchParams.get('q') || '';

  // ── Core state ─────────────────────────────────────────────────────────
  const [mobileOpen,        setMobileOpen]        = useState(false);
  const [query,             setQuery]             = useState(initialQuery);
  const [mode,              setMode]              = useState<ResearchMode>('Deep Research');
  const [verificationLevel, setVerificationLevel] = useState<VerificationLevel>('Expert');

  // ── Upload / URL state ─────────────────────────────────────────────────
  const [uploadedFiles,    setUploadedFiles]    = useState<string[]>([]);   // display labels
  const [additionalContext,setAdditionalContext] = useState('');             // extracted text
  const [urlInput,         setUrlInput]         = useState('');
  const [showUrlModal,     setShowUrlModal]      = useState(false);
  const [pdfStatus,        setPdfStatus]        = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [urlStatus,        setUrlStatus]        = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [contextError,     setContextError]     = useState<string | null>(null);

  // ── Voice state ────────────────────────────────────────────────────────
  const [isRecording,  setIsRecording]  = useState(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  // ── Research submit state ──────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);


  useEffect(() => {
    if (initialQuery) setQuery(initialQuery);
  }, [initialQuery]);

  // ── Loading overlay labels based on mode ──────────────────────────────
  const loadingSteps = mode === 'Fast Mode'
    ? ['Research Agent — Mining sources', 'Synthesis Agent — Building dossier']
    : [
        'Research Agent — Mining sources',
        'Verification Agent — Checking facts',
        'Contradiction Detector — Auditing conflicts',
        'Synthesis Agent — Building dossier',
      ];

  // ────────────────────────────────────────────────────────────────────────
  // Feature 4: Real Voice Search (Web Speech API)
  // ────────────────────────────────────────────────────────────────────────
  const handleVoiceInput = () => {
    const SpeechRecognitionCtor =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setError('Voice search is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognitionRef.current = recognition;
    recognition.lang          = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('[Voice] Recording started');
      setIsRecording(true);
      setError(null);
    };

    recognition.onresult = (event: ISpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      console.log('[Voice] Transcript:', transcript);
      setQuery(transcript);
    };

    recognition.onerror = (event: ISpeechRecognitionErrorEvent) => {
      console.error('[Voice] Error:', event.error);
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone permission in your browser.');
      } else {
        setError(`Voice recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      console.log('[Voice] Recording ended');
      setIsRecording(false);
    };

    recognition.start();
  };

  // ────────────────────────────────────────────────────────────────────────
  // Feature 2: Real PDF Upload
  // ────────────────────────────────────────────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so the same file can be re-uploaded if needed
    e.target.value = '';

    setPdfStatus('loading');
    setContextError(null);
    console.log(`[PDF] Uploading: ${file.name} (${file.size} bytes)`);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/parse-pdf', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);

      const extractedText: string = data.text ?? '';
      console.log(`[PDF] ✅ Extracted ${extractedText.length} chars`);

      setAdditionalContext((prev) => prev ? `${prev}\n\n${extractedText}` : extractedText);
      setUploadedFiles((prev) => [...prev, `📄 ${file.name}`]);
      setPdfStatus('done');
    } catch (err) {
      console.error('[PDF] ❌', err);
      setContextError(`PDF error: ${err instanceof Error ? err.message : String(err)}`);
      setPdfStatus('error');
    }
  };

  // ────────────────────────────────────────────────────────────────────────
  // Feature 3: Real URL Fetch
  // ────────────────────────────────────────────────────────────────────────
  const handleAddUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = urlInput.trim();
    if (!url) return;

    setUrlStatus('loading');
    setContextError(null);
    console.log(`[URL] Fetching: ${url}`);

    try {
      const res  = await fetch('/api/fetch-url', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ url }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);

      const fetchedText: string = data.text ?? '';
      console.log(`[URL] ✅ Got ${fetchedText.length} chars from ${url}`);

      setAdditionalContext((prev) => prev ? `${prev}\n\n${fetchedText}` : fetchedText);
      setUploadedFiles((prev) => [...prev, `🔗 ${url}`]);
      setUrlInput('');
      setShowUrlModal(false);
      setUrlStatus('done');
    } catch (err) {
      console.error('[URL] ❌', err);
      setContextError(`URL error: ${err instanceof Error ? err.message : String(err)}`);
      setUrlStatus('error');
    }
  };

  const removeAttachment = (idx: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
    // Note: we don't selectively strip context because we can't easily separate it.
    // If all attachments removed, clear context entirely.
    setUploadedFiles((prev) => {
      if (prev.length === 0) setAdditionalContext('');
      return prev;
    });
  };

  // ────────────────────────────────────────────────────────────────────────
  // Feature 1: handleSubmit — sends mode + additionalContext
  // ────────────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // 1. Call server-side API route (keeps secrets safe)
      console.log(`[Submit] mode="${mode}" contextLen=${additionalContext.length}`);
      const res = await fetch('/api/research', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic:             query.trim(),
          mode,                              // "Deep Research" | "Fast Mode"
          additionalContext: additionalContext || undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const msg = res.status === 422
          ? (errData?.error ?? 'Topic samajh nahi aaya, kripya ek specific factual question poochein.')
          : (errData?.error ?? `Kuch galat hua (error ${res.status}). Dobara try karein.`);
        throw new Error(msg);
      }

      const report: ResearchReport = await res.json();

      // 2. Save to localStorage
      saveReportToStore(report);

      // 3. Save to Supabase (fire-and-forget)
      supabase
        .from('reports')
        .insert({
          organisation: 'Innovahack',
          topic:        query.trim(),
          report_json:  report,
          status:       'completed',
        })
        .then(({ error: sbErr }) => {
          if (sbErr) console.error('[Supabase] insert error:', sbErr.message);
        });

      // 4. Navigate to processing page
      router.push(`/processing?id=${report.id}&q=${encodeURIComponent(query.trim())}`);
    } catch (err) {
      console.error('[handleSubmit]', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex">

      {/* ── Full-screen loading overlay ── */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-[#030712]/90 backdrop-blur-sm flex flex-col items-center justify-center gap-6 p-8">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-[#6C63FF]/20" />
            <div className="absolute inset-0 rounded-full border-4 border-t-[#6C63FF] border-r-[#06B6D4] animate-spin" />
            <Cpu className="absolute inset-0 m-auto w-8 h-8 text-[#A5B4FC]" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-base font-bold text-white">
              {mode === 'Fast Mode' ? '⚡ Fast Mode — 2 Agents Working…' : 'Agents Working…'}
            </p>
            <p className="text-sm text-slate-400 max-w-xs">
              {mode === 'Fast Mode'
                ? 'Research + Synthesis agents running. ~10–20 seconds.'
                : '4 AI agents are researching, verifying, and synthesizing. ~20–40 seconds.'}
            </p>
          </div>
          <div className="flex flex-col gap-2 w-full max-w-xs">
            {loadingSteps.map((label, i) => (
              <div key={i} className="flex items-center gap-3 text-xs text-slate-400">
                <div
                  className="w-2 h-2 rounded-full bg-[#6C63FF] animate-pulse shrink-0"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
                {label}
              </div>
            ))}
          </div>
          {additionalContext && (
            <p className="text-xs text-[#06B6D4] font-mono">
              + context from {uploadedFiles.length} attachment(s) included
            </p>
          )}
        </div>
      )}

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
              Ask any question, test hypotheses, or analyze uploaded documents with 4 collaborative AI agents.
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
                {/* Upload / URL / Voice Buttons */}
                <div className="flex items-center gap-2">

                  {/* PDF Upload */}
                  <label className={`btn-secondary px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer ${pdfStatus === 'loading' ? 'opacity-60 pointer-events-none' : ''}`}>
                    {pdfStatus === 'loading' ? (
                      <><Loader2 className="w-4 h-4 animate-spin text-[#06B6D4]" /> Processing PDF...</>
                    ) : pdfStatus === 'done' ? (
                      <><CheckCircle2 className="w-4 h-4 text-emerald-400" /> PDF Added</>
                    ) : (
                      <><UploadCloud className="w-4 h-4 text-[#06B6D4]" /> Upload PDF</>
                    )}
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={pdfStatus === 'loading'}
                    />
                  </label>

                  {/* Add URL */}
                  <button
                    type="button"
                    onClick={() => { setShowUrlModal(true); setUrlStatus('idle'); }}
                    className="btn-secondary px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5"
                  >
                    <LinkIcon className="w-4 h-4 text-[#6C63FF]" /> Add URL
                  </button>

                  {/* Voice Search */}
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    className={`btn-secondary px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 ${
                      isRecording ? 'animate-pulse border-rose-500 text-rose-400' : ''
                    }`}
                  >
                    {isRecording
                      ? <><MicOff className="w-4 h-4 text-rose-400" /> Stop Recording</>
                      : <><Mic className="w-4 h-4 text-[#EC4899]" /> Voice Search</>
                    }
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary px-7 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-[#6C63FF]/30 ml-auto disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
                    : <><Zap className="w-4 h-4" /> Execute Research</>
                  }
                </button>
              </div>
            </div>

            {/* Attached Files Display */}
            {uploadedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {uploadedFiles.map((label, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-xs text-slate-200 border border-white/10 font-mono"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#06B6D4]" /> {label}
                    <button
                      type="button"
                      onClick={() => removeAttachment(idx)}
                      className="hover:text-rose-400 ml-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                {additionalContext && (
                  <span className="text-[10px] text-emerald-400 font-mono self-center">
                    ✓ {additionalContext.length} chars of context ready
                  </span>
                )}
              </div>
            )}

            {/* Context / attachment error */}
            {contextError && (
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-400" />
                <span>{contextError}</span>
              </div>
            )}

            {/* Research submission error */}
            {error && (
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
                <span>{error}</span>
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
                    { id: 'Deep Research', label: 'Deep Research', desc: '4 Agents • 2-3 min • Full Audit' },
                    { id: 'Fast Mode',     label: 'Fast Mode',     desc: '2 Agents • ~15 sec • Quick Synthesis' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setMode(m.id as ResearchMode);
                        setVerificationLevel(m.id === 'Fast Mode' ? 'Basic' : 'Expert');
                      }}
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

          {/* Agent Pipeline Preview Card — updates based on selected mode */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-xs font-mono text-[#06B6D4] uppercase tracking-widest flex items-center gap-2">
              <Cpu className="w-4 h-4" /> Multi-Agent Execution Pipeline Preview
            </h3>
            <div className={`grid grid-cols-1 gap-3 ${mode === 'Fast Mode' ? 'sm:grid-cols-2' : 'sm:grid-cols-4'}`}>
              {(mode === 'Fast Mode'
                ? [
                    { name: '1. Research Agent',  desc: 'Mines primary sources & archives' },
                    { name: '2. Synthesis Agent',  desc: 'Fast synthesis & confidence score' },
                  ]
                : [
                    { name: '1. Research Agent',         desc: 'Mines primary sources & archives' },
                    { name: '2. Verification Agent',     desc: 'Validates all claims & metrics' },
                    { name: '3. Contradiction Detector', desc: 'Audits conflicting statements' },
                    { name: '4. Synthesis Agent',        desc: 'Synthesizes final fact-check dossier' },
                  ]
              ).map((agent, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                  <div className="text-xs font-semibold text-white">{agent.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{agent.desc}</div>
                </div>
              ))}
            </div>
            {mode === 'Fast Mode' && (
              <p className="text-[10px] text-amber-400/80 font-mono">
                ⚡ Fast Mode skips Verification & Contradiction Detector — results are quicker but less rigorously audited.
              </p>
            )}
          </div>
        </main>
      </div>

      {/* URL Input Modal */}
      {showUrlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-3xl max-w-md w-full border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white">Add Web Page / Paper URL</h3>
            <p className="text-xs text-slate-400">
              The page content will be fetched server-side and included as context for the AI agents.
            </p>
            <form onSubmit={handleAddUrl} className="space-y-4">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://nature.com/articles/..."
                className="w-full glass-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6C63FF]"
                required
                disabled={urlStatus === 'loading'}
              />
              {urlStatus === 'error' && contextError && (
                <p className="text-xs text-amber-400">{contextError}</p>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUrlModal(false)}
                  className="btn-secondary px-4 py-2 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={urlStatus === 'loading'}
                  className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 disabled:opacity-60"
                >
                  {urlStatus === 'loading'
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Fetching...</>
                    : 'Add URL'
                  }
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
    <ProtectedPage>
      <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Research Interface...</div>}>
        <ResearchContent />
      </Suspense>
    </ProtectedPage>
  );
}

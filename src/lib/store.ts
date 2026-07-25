'use client';

import { ResearchReport } from '@/types';
// sampleReports is kept for reference but never auto-seeded
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { sampleReports } from './mockData';

// ── All fake account/user localStorage keys are removed.
//    User identity now comes from Supabase Auth (see src/lib/auth.ts).
// ─────────────────────────────────────────────────────────────────────────────

const REPORTS_KEY = 'verigen_reports';

// ─────────────────────────────────────────────────────────────────────────────
// Reports Store (localStorage — client-side cache of research results)
// ─────────────────────────────────────────────────────────────────────────────

export const getStoredReports = (): ResearchReport[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(REPORTS_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading reports from localStorage:', e);
    return [];
  }
};

export const saveReportToStore = (report: ResearchReport): ResearchReport[] => {
  const current = getStoredReports();
  const index   = current.findIndex((r) => r.id === report.id);
  let updated: ResearchReport[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = report;
  } else {
    updated = [report, ...current];
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('verigen_reports_updated'));
  }
  return updated;
};

export const deleteReportFromStore = (id: string): ResearchReport[] => {
  const current = getStoredReports();
  const updated = current.filter((r) => r.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('verigen_reports_updated'));
  }
  return updated;
};

export const toggleSaveReportStore = (id: string): ResearchReport[] => {
  const current = getStoredReports();
  const updated = current.map((r) => (r.id === id ? { ...r, saved: !r.saved } : r));
  if (typeof window !== 'undefined') {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('verigen_reports_updated'));
  }
  return updated;
};

export const clearAllReportsStore = (): ResearchReport[] => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(REPORTS_KEY, JSON.stringify([]));
    window.dispatchEvent(new Event('verigen_reports_updated'));
  }
  return [];
};

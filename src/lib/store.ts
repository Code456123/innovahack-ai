'use client';

import { ResearchReport, UserProfile } from '@/types';
import { sampleReports } from './mockData';
import { defaultAccounts, UserAccount } from './users';

const REPORTS_KEY = 'verigen_reports';
const ACCOUNTS_KEY = 'verigen_user_accounts_db';
const CURRENT_USER_EMAIL_KEY = 'verigen_current_user_email';

export const getStoredAccounts = (): UserAccount[] => {
  if (typeof window === 'undefined') return defaultAccounts;
  try {
    const data = localStorage.getItem(ACCOUNTS_KEY);
    if (!data) {
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(defaultAccounts));
      return defaultAccounts;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading user accounts:', e);
    return defaultAccounts;
  }
};

export const saveAccount = (account: UserAccount): UserAccount[] => {
  const current = getStoredAccounts();
  const index = current.findIndex((a) => a.email.toLowerCase() === account.email.toLowerCase());
  let updated: UserAccount[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = account;
  } else {
    updated = [account, ...current];
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(updated));
  }
  return updated;
};

export const getCurrentUserEmail = (): string => {
  if (typeof window === 'undefined') return 'researcher@verigen.ai';
  return localStorage.getItem(CURRENT_USER_EMAIL_KEY) || 'researcher@verigen.ai';
};

export const setCurrentUserEmail = (email: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CURRENT_USER_EMAIL_KEY, email.toLowerCase());
    window.dispatchEvent(new Event('verigen_user_updated'));
  }
};

export const getStoredReports = (): ResearchReport[] => {
  if (typeof window === 'undefined') return sampleReports;
  try {
    const data = localStorage.getItem(REPORTS_KEY);
    if (!data) {
      localStorage.setItem(REPORTS_KEY, JSON.stringify(sampleReports));
      return sampleReports;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading reports from localStorage:', e);
    return sampleReports;
  }
};

export const saveReportToStore = (report: ResearchReport): ResearchReport[] => {
  const current = getStoredReports();
  const index = current.findIndex((r) => r.id === report.id);
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

export const getStoredUserProfile = (): UserProfile => {
  const activeEmail = getCurrentUserEmail();
  const accounts = getStoredAccounts();
  const found = accounts.find((a) => a.email.toLowerCase() === activeEmail.toLowerCase());
  return found ? found.profile : defaultAccounts[0].profile;
};

export const updateUserProfileStore = (updatedProfile: Partial<UserProfile>): UserProfile => {
  const activeEmail = getCurrentUserEmail();
  const accounts = getStoredAccounts();
  const index = accounts.findIndex((a) => a.email.toLowerCase() === activeEmail.toLowerCase());

  let targetAccount: UserAccount;
  if (index >= 0) {
    targetAccount = accounts[index];
    targetAccount.profile = { ...targetAccount.profile, ...updatedProfile };
    accounts[index] = targetAccount;
  } else {
    targetAccount = {
      email: activeEmail,
      passwordHash: 'Research#2026',
      role: 'Researcher',
      profile: { ...defaultAccounts[0].profile, ...updatedProfile, email: activeEmail },
    };
    accounts.push(targetAccount);
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    window.dispatchEvent(new Event('verigen_user_updated'));
  }
  return targetAccount.profile;
};

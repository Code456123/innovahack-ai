export type VerificationLevel = 'Basic' | 'Advanced' | 'Expert';
export type ResearchMode = 'Deep Research' | 'Fast Mode';
export type ReportStatus = 'Completed' | 'In Progress' | 'Failed';

export interface VerifiedClaim {
  id: string;
  text: string;
  confidence: number;
  badge: 'High' | 'Medium' | 'Low';
  verified: boolean;
  citation: string;
  sourceUrl: string;
}

export interface Contradiction {
  id: string;
  claim: string;
  sourceA: { name: string; quote: string };
  sourceB: { name: string; quote: string };
  resolution: string;
}

export interface Source {
  id: string;
  title: string;
  domain: string;
  reliability: number;
  date: string;
  url: string;
  type: 'Government' | 'Research Papers' | 'News' | 'Books' | 'Encyclopedia' | 'Article' | 'Reference';
}

export interface AgentProgress {
  name: string;
  status: 'Completed' | 'Running' | 'Pending';
  timeTaken: string;
  description: string;
}

export interface ResearchReport {
  id: string;
  query: string;
  date: string;
  time: string;
  confidence: number;
  status: ReportStatus;
  mode: ResearchMode;
  verificationLevel: VerificationLevel;
  summary: string;
  detailedAnalysis: string;
  verifiedClaims: VerifiedClaim[];
  contradictions: Contradiction[];
  sources: Source[];
  saved: boolean;
  tags: string[];
  agents: AgentProgress[];
}

export interface UserProfile {
  fullName: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  theme: 'dark' | 'light' | 'system';
  language: string;
  notifications: {
    emailAlerts: boolean;
    reportComplete: boolean;
    weeklyDigest: boolean;
  };
  defaultMode: ResearchMode;
}

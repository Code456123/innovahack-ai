import { UserProfile } from '@/types';

export interface UserAccount {
  email: string;
  passwordHash: string; // Plaintext or hashed for simulation
  profile: UserProfile;
  role: 'Researcher' | 'Analyst' | 'Lead Researcher' | 'System Admin';
}

export const defaultAccounts: UserAccount[] = [
  {
    email: 'researcher@verigen.ai',
    passwordHash: 'Research#2026',
    role: 'Researcher',
    profile: {
      fullName: 'Shivam Chaubey',
      username: 'shivam_verigen',
      email: 'researcher@verigen.ai',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      bio: 'AI Safety Researcher focusing on autonomous multi-agent verification & hallucination audits.',
      theme: 'dark',
      language: 'English (US)',
      notifications: { emailAlerts: true, reportComplete: true, weeklyDigest: false },
      defaultMode: 'Deep Research',
    },
  },
  {
    email: 'analyst@verigen.ai',
    passwordHash: 'Verify#2026',
    role: 'Analyst',
    profile: {
      fullName: 'Dr. Aris Thorne',
      username: 'aris_analyst',
      email: 'analyst@verigen.ai',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      bio: 'Lead Biomedical Data Analyst & Clinical Trial Auditor.',
      theme: 'dark',
      language: 'English (US)',
      notifications: { emailAlerts: true, reportComplete: true, weeklyDigest: true },
      defaultMode: 'Fast Mode',
    },
  },
  {
    email: 'admin@verigen.ai',
    passwordHash: 'AdminKey#2026',
    role: 'System Admin',
    profile: {
      fullName: 'System Admin Overseer',
      username: 'admin_root',
      email: 'admin@verigen.ai',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
      bio: 'Multi-Agent Infrastructure Administrator & Gateway Controller.',
      theme: 'dark',
      language: 'English (US)',
      notifications: { emailAlerts: true, reportComplete: true, weeklyDigest: true },
      defaultMode: 'Deep Research',
    },
  },
];

// Validation Helper Functions
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isValidPassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  if (!hasLetter || !hasNumber) {
    return { valid: false, message: 'Password must contain both letters and numbers.' };
  }
  return { valid: true };
};

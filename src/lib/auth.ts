// Re-export everything from the canonical AuthContext
// This file is kept for backward compatibility with any imports of '@/lib/auth'
export { useAuth, getUserDisplayName, getUserAvatar, getUserEmail } from './AuthContext';

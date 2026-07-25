'use client';

// Signup is handled in the combined login page (/login) via the "Sign Up" tab.
// This page just redirects there.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/login'); }, [router]);
  return null;
}

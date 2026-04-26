'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getActiveSession } from '@/lib/auth';
import type { Session } from '@/types/auth';

type ProtectedSessionResult = {
  isReady: boolean;
  session: Session | null;
};

export default function useProtectedSession(): ProtectedSessionResult {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const activeSession = getActiveSession();
    setSession(activeSession);
    setIsReady(true);

    if (!activeSession) {
      router.replace('/login');
    }
  }, [router]);

  return {
    isReady,
    session,
  };
}

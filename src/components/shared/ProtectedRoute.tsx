'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getActiveSession } from '@/lib/auth';
import { ROUTES } from '@/lib/constants';
import type { Session } from '@/types/auth';

type ProtectedRouteProps = {
  children: (session: Session) => React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const activeSession = getActiveSession();

    if (!activeSession) {
      setSession(null);
      setIsReady(true);
      router.replace(ROUTES.login);
      return;
    }

    setSession(activeSession);
    setIsReady(true);
  }, [router]);

  if (!isReady || !session) {
    return null;
  }

  return <>{children(session)}</>;
}

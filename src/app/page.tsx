'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import SplashScreen from '@/components/shared/SplashScreen';
import { ROUTES, SPLASH_DELAY_MS } from '@/lib/constants';
import { getStoredSession } from '@/lib/storage';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const session = getStoredSession();

      if (session) {
        router.replace(ROUTES.dashboard);
        return;
      }

      router.replace(ROUTES.login);
    }, SPLASH_DELAY_MS);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [router]);

  return <SplashScreen />;
}

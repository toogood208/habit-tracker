'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import SplashScreen from '@/components/shared/SplashScreen';
import { getStoredSession } from '@/lib/storage';

const SPLASH_DELAY_MS = 1000;

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const session = getStoredSession();

      if (session) {
        router.replace('/dashboard');
        return;
      }

      router.replace('/login');
    }, SPLASH_DELAY_MS);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [router]);

  return <SplashScreen />;
}

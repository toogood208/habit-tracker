'use client';

import SplashScreen from "@/components/shared/SplashScreen";
import { getActiveSession } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SPLASH_DELAY_MS = 1000;

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const session = getActiveSession();

      if (session) {
        router.replace('/dashboard');
        return;
      }

      router.replace('/login');
    }, SPLASH_DELAY_MS);

    return () => {
      window.clearTimeout(timeout);
    }
  }, [router]);

  return <SplashScreen />;
}
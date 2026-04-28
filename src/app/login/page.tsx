'use client';

import { useRouter } from 'next/navigation';

import LoginForm from '@/components/auth/LoginForm';
import { APP_NAME, ROUTES } from '@/lib/constants';

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10">
      <div className="app-grid absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(199,103,60,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(24,59,58,0.12),transparent_32%)]" />
      <div className="relative w-full max-w-md space-y-6">
        <div className="app-panel rounded-[2rem] p-6 text-center lg:text-left">
          <div className="inline-flex rounded-full border border-[#d8c9b2] bg-white/60 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#a1643d]">
            {APP_NAME}
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-[#1d2430]">
            Welcome Back
          </h1>
          <p className="mt-3 max-w-md text-sm text-[#6d5a48]">
            Log in to continue tracking your habits, protect your streaks, and
            keep today&apos;s progress comfortably in view.
          </p>
        </div>
        <LoginForm onSuccess={() => router.push(ROUTES.dashboard)} />
        <p className="text-center text-sm text-[#6d5a48] lg:text-left">
          New here?{' '}
          <button
            type="button"
            onClick={() => router.push(ROUTES.signup)}
            className="font-semibold text-[#183b3a] underline decoration-[#c7673c] underline-offset-4"
          >
            Create an account
          </button>
        </p>
      </div>
    </main>
  );
}

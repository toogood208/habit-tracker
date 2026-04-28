'use client';

import { useRouter } from 'next/navigation';

import SignupForm from '@/components/auth/SignupForm';
import { APP_NAME, ROUTES } from '@/lib/constants';

export default function SignupPage() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10">
      <div className="app-grid absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(226,178,90,0.2),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(24,59,58,0.12),transparent_28%)]" />
      <div className="relative w-full max-w-md space-y-6">
        <div className="app-panel rounded-[2rem] p-6 text-center lg:text-left">
          <div className="inline-flex rounded-full border border-[#d8c9b2] bg-white/60 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#a1643d]">{APP_NAME}</div>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#1d2430]">Create Account</h1>
          <p className="mt-3 max-w-md text-sm text-[#6d5a48]">
            Start building small wins every day with a dashboard that stays calm, clear, and easy to return to.
          </p>
        </div>

        <SignupForm onSuccess={() => router.push(ROUTES.dashboard)} />

        <p className="text-center text-sm text-[#6d5a48] lg:text-left">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => router.push(ROUTES.login)}
            className="font-semibold text-[#183b3a] underline decoration-[#c7673c] underline-offset-4"
          >
            Log in
          </button>
        </p>
      </div>
    </main>
  );
}

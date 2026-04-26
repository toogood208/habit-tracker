'use client';

import { useRouter } from 'next/navigation';

import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
          <p className="mt-2 text-sm text-slate-600">
            Start building small wins every day.
          </p>
        </div>

        <SignupForm onSuccess={() => router.push('/dashboard')} />

        <p className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="font-semibold text-slate-900 underline"
          >
            Log in
          </button>
        </p>
      </div>
    </main>
  );
}

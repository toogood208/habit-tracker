'use client';

import LoginForm from "@/components/auth/LoginForm";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-10">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900"> Welcome Back</h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Log in to continue tracking your habits.
                    </p>
                </div>
                <LoginForm onSuccess={() => router.push('/dashboard')} />
                <p className="text-center text-sm text-slate-600">
                    New here?{' '}
                    <button
                        type="button"
                        onClick={() => router.push('/signup')}
                        className="font-semibold text-slate-900 underline"
                    >
                        Create an account
                    </button>
                </p>
            </div>
        </main>
    )
}
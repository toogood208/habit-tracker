'use client';

import TextField from '@/components/shared/TextField';
import useAuthForm from '@/hooks/useAuthForm';
import FeedbackMessage from '../shared/FeedbackMessage';
import Button from '../shared/Button';

type SignupFormProps = {
    onSuccess: () => void;
};

export default function SignupForm({ onSuccess }: SignupFormProps) {
    const { email, password, error, setEmail, setPassword, handleSubmit } =
        useAuthForm({
            mode: 'signup',
            onSuccess,
        });

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl bg-white p-6 shadow-lg"
        >
            <TextField
                id="signup-email"
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                testId="auth-signup-email"
            />

            <TextField
                id="signup-password"
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                testId="auth-signup-password"
            />

            <FeedbackMessage message={error} variant="error" />

            <Button type="submit" testId="auth-signup-submit" variant="primary">
                Sign Up
            </Button>

        </form>
    );
}

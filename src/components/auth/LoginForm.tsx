'use client';

import TextField from '@/components/shared/TextField';
import useAuthForm from '@/hooks/useAuthForm';
import FeedbackMessage from '../shared/FeedbackMessage';
import Button from '../shared/Button';


type LoginFormProps = {
    onSuccess: () => void;
};

export default function LoginForm({ onSuccess }: LoginFormProps) {
    const { email, password, error, setEmail, setPassword, handleSubmit } =
        useAuthForm({
            mode: 'login',
            onSuccess,
        });

    return (
        <form
            onSubmit={handleSubmit}
            className="app-panel space-y-5 rounded-[2rem] p-6"
        >
            <TextField
                id="login-email"
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                testId="auth-login-email"
            />

            <TextField
                id="login-password"
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                testId="auth-login-password"
                allowPasswordToggle
            />

            <FeedbackMessage message={error} variant="error" />

            <Button type="submit" testId="auth-login-submit" variant="primary">
                Enter Dashboard
            </Button>
        </form>
    );
}

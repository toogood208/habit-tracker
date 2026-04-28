'use client';

import { useState } from 'react';

import TextField from '@/components/shared/TextField';
import { loginUser } from '@/lib/auth';
import Button from '@/components/shared/Button';
import FeedbackMessage from '@/components/shared/FeedbackMessage';

type LoginFormProps = {
  onSuccess: () => void;
};

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const result = loginUser(email, password);

    if (!result.success) {
      setError(result.error);
      return;
    }

    onSuccess();
  }

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
      />

      <FeedbackMessage message={error} variant="error" />

      <Button type="submit" testId="auth-login-submit" variant="primary">
        Enter Dashboard
      </Button>
    </form>
  );
}

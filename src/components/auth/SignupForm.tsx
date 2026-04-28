'use client';

import { useState } from 'react';

import TextField from '@/components/shared/TextField';
import { signupUser } from '@/lib/auth';
import Button from '@/components/shared/Button';
import FeedbackMessage from '@/components/shared/FeedbackMessage';

type SignupFormProps = {
  onSuccess: () => void;
};

export default function SignupForm({ onSuccess }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const result = signupUser(email, password);

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
        Create Account
      </Button>
    </form>
  );
}

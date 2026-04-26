import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import {
  SESSION_STORAGE_KEY,
  USERS_STORAGE_KEY,
} from '@/lib/storage';

const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
    replace: vi.fn(),
  }),
}));

describe('auth flow', () => {
  beforeEach(() => {
    localStorage.clear();
    pushMock.mockReset();
  });

  it('submits the signup form and creates a session', () => {
    render(<SignupForm onSuccess={() => pushMock('/dashboard')} />);

    fireEvent.change(screen.getByTestId('auth-signup-email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByTestId('auth-signup-password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByTestId('auth-signup-submit'));

    const storedUsers = JSON.parse(
      localStorage.getItem(USERS_STORAGE_KEY) ?? '[]'
    );
    const storedSession = JSON.parse(
      localStorage.getItem(SESSION_STORAGE_KEY) ?? 'null'
    );

    expect(storedUsers).toHaveLength(1);
    expect(storedUsers[0].email).toBe('test@example.com');
    expect(storedSession.email).toBe('test@example.com');
    expect(pushMock).toHaveBeenCalledWith('/dashboard');
  });

  it('shows an error for duplicate signup email', () => {
    localStorage.setItem(
      USERS_STORAGE_KEY,
      JSON.stringify([
        {
          id: 'user-1',
          email: 'test@example.com',
          password: 'password123',
          createdAt: '2026-04-26T10:00:00.000Z',
        },
      ])
    );

    render(<SignupForm onSuccess={() => pushMock('/dashboard')} />);

    fireEvent.change(screen.getByTestId('auth-signup-email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByTestId('auth-signup-password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByTestId('auth-signup-submit'));

    expect(screen.getByRole('alert')).toHaveTextContent('User already exists');
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('submits the login form and stores the active session', () => {
    localStorage.setItem(
      USERS_STORAGE_KEY,
      JSON.stringify([
        {
          id: 'user-1',
          email: 'test@example.com',
          password: 'password123',
          createdAt: '2026-04-26T10:00:00.000Z',
        },
      ])
    );

    render(<LoginForm onSuccess={() => pushMock('/dashboard')} />);

    fireEvent.change(screen.getByTestId('auth-login-email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByTestId('auth-login-password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByTestId('auth-login-submit'));

    const storedSession = JSON.parse(
      localStorage.getItem(SESSION_STORAGE_KEY) ?? 'null'
    );

    expect(storedSession).toEqual({
      userId: 'user-1',
      email: 'test@example.com',
    });
    expect(pushMock).toHaveBeenCalledWith('/dashboard');
  });

  it('shows an error for invalid login credentials', () => {
    localStorage.setItem(
      USERS_STORAGE_KEY,
      JSON.stringify([
        {
          id: 'user-1',
          email: 'test@example.com',
          password: 'password123',
          createdAt: '2026-04-26T10:00:00.000Z',
        },
      ])
    );

    render(<LoginForm onSuccess={() => pushMock('/dashboard')} />);

    fireEvent.change(screen.getByTestId('auth-login-email'), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByTestId('auth-login-password'), {
      target: { value: 'wrongpass' },
    });
    fireEvent.click(screen.getByTestId('auth-login-submit'));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Invalid email or password'
    );
    expect(pushMock).not.toHaveBeenCalled();
  });
});

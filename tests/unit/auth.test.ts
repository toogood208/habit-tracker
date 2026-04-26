import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getActiveSession,
  isAuthenticated,
  loginUser,
  logoutUser,
  signupUser,
} from '@/lib/auth';
import {
  getStoredSession,
  getStoredUsers,
} from '@/lib/storage';

describe('auth helpers', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('signs up a new user and creates a session', () => {
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('user-1');

    const result = signupUser('test@example.com', 'password123');

    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
    expect(result.session).toEqual({
      userId: 'user-1',
      email: 'test@example.com',
    });
    expect(getStoredUsers()).toHaveLength(1);
    expect(getStoredSession()).toEqual({
      userId: 'user-1',
      email: 'test@example.com',
    });
  });

  it('rejects empty signup credentials', () => {
    const result = signupUser('   ', '   ');

    expect(result).toEqual({
      success: false,
      error: 'Email and password are required',
      session: null,
    });
  });

  it('rejects duplicate signup emails', () => {
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('user-1');
    signupUser('test@example.com', 'password123');

    const duplicateResult = signupUser('test@example.com', 'password123');

    expect(duplicateResult).toEqual({
      success: false,
      error: 'User already exists',
      session: null,
    });
  });

  it('logs in an existing user and stores the session', () => {
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('user-1');
    signupUser('test@example.com', 'password123');
    logoutUser();

    const result = loginUser('test@example.com', 'password123');

    expect(result.success).toBe(true);
    expect(result.session).toEqual({
      userId: 'user-1',
      email: 'test@example.com',
    });
    expect(getActiveSession()).toEqual({
      userId: 'user-1',
      email: 'test@example.com',
    });
    expect(isAuthenticated()).toBe(true);
  });

  it('rejects invalid login credentials', () => {
    const result = loginUser('wrong@example.com', 'badpass');

    expect(result).toEqual({
      success: false,
      error: 'Invalid email or password',
      session: null,
    });
  });

  it('clears the session on logout', () => {
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('user-1');
    signupUser('test@example.com', 'password123');

    logoutUser();

    expect(getActiveSession()).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });
});

import { beforeEach, describe, expect, it } from 'vitest';

import {
  getStoredHabits,
  getStoredSession,
  getStoredUsers,
  HABITS_STORAGE_KEY,
  SESSION_STORAGE_KEY,
  setStoredHabits,
  setStoredSession,
  setStoredUsers,
  USERS_STORAGE_KEY,
} from '@/lib/storage';

describe('storage helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty arrays and null when storage is empty', () => {
    expect(getStoredUsers()).toEqual([]);
    expect(getStoredHabits()).toEqual([]);
    expect(getStoredSession()).toBeNull();
  });

  it('stores and reads users, habits, and session', () => {
    const users = [
      {
        id: 'user-1',
        email: 'test@example.com',
        password: 'password123',
        createdAt: '2026-04-26T10:00:00.000Z',
      },
    ];
    const habits = [
      {
        id: 'habit-1',
        userId: 'user-1',
        name: 'Drink Water',
        description: 'Eight glasses',
        frequency: 'daily' as const,
        createdAt: '2026-04-26T10:05:00.000Z',
        completions: ['2026-04-26'],
      },
    ];
    const session = {
      userId: 'user-1',
      email: 'test@example.com',
    };

    setStoredUsers(users);
    setStoredHabits(habits);
    setStoredSession(session);

    expect(getStoredUsers()).toEqual(users);
    expect(getStoredHabits()).toEqual(habits);
    expect(getStoredSession()).toEqual(session);
  });

  it('falls back safely when stored JSON is malformed', () => {
    localStorage.setItem(USERS_STORAGE_KEY, '{broken');
    localStorage.setItem(HABITS_STORAGE_KEY, '{broken');
    localStorage.setItem(SESSION_STORAGE_KEY, '{broken');

    expect(getStoredUsers()).toEqual([]);
    expect(getStoredHabits()).toEqual([]);
    expect(getStoredSession()).toBeNull();
  });
});

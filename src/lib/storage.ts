import type { Session, User } from '@/types/auth';
import type { Habit } from '@/types/habit';

export const USERS_STORAGE_KEY = 'habit-tracker-users';
export const SESSION_STORAGE_KEY = 'habit-tracker-session';
export const HABITS_STORAGE_KEY = 'habit-tracker-habits';

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const rawValue = window.localStorage.getItem(key);

  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getStoredUsers(): User[] {
  return readStorage<User[]>(USERS_STORAGE_KEY, []);
}

export function setStoredUsers(users: User[]): void {
  writeStorage(USERS_STORAGE_KEY, users);
}

export function getStoredSession(): Session | null {
  return readStorage<Session | null>(SESSION_STORAGE_KEY, null);
}

export function setStoredSession(session: Session | null): void {
  writeStorage(SESSION_STORAGE_KEY, session);
}

export function getStoredHabits(): Habit[] {
  return readStorage<Habit[]>(HABITS_STORAGE_KEY, []);
}

export function setStoredHabits(habits: Habit[]): void {
  writeStorage(HABITS_STORAGE_KEY, habits);
}

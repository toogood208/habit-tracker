import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES, SPLASH_DELAY_MS } from '@/lib/constants';
import {
  createHabit,
  deleteHabit,
  getHabitsForUser,
  toggleHabitCompletion,
  toggleHabitForDate,
  updateHabit,
} from '@/lib/habits';
import { getStoredHabits } from '@/lib/storage';
import type { Habit } from '@/types/habit';

describe('habit helpers', () => {
  const baseHabit: Habit = {
    id: 'habit-1',
    userId: 'user-1',
    name: 'Drink Water',
    description: 'Drink 8 glasses',
    frequency: 'daily',
    createdAt: '2026-04-25T10:00:00.000Z',
    completions: [],
  };

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('adds a completion date when the date is not present', () => {
    const updatedHabit = toggleHabitCompletion(baseHabit, '2026-04-25');

    expect(updatedHabit.completions).toEqual(['2026-04-25']);
  });

  it('removes a completion date when the date already exists', () => {
    const completedHabit: Habit = {
      ...baseHabit,
      completions: ['2026-04-25'],
    };

    const updatedHabit = toggleHabitCompletion(completedHabit, '2026-04-25');

    expect(updatedHabit.completions).toEqual([]);
  });

  it('does not mutate the original habit object', () => {
    const habit: Habit = {
      ...baseHabit,
      completions: [],
    };

    const updatedHabit = toggleHabitCompletion(habit, '2026-04-25');

    expect(habit.completions).toEqual([]);
    expect(updatedHabit).not.toBe(habit);
  });

  it('does not return duplicate completion dates', () => {
    const habitWithDuplicates: Habit = {
      ...baseHabit,
      completions: ['2026-04-25', '2026-04-25'],
    };

    const updatedHabit = toggleHabitCompletion(habitWithDuplicates, '2026-04-24');
    const uniqueDates = [...new Set(updatedHabit.completions)];

    expect(updatedHabit.completions).toEqual(uniqueDates);
  });

  it('filters habits by user id', () => {
    localStorage.setItem(
      'habit-tracker-habits',
      JSON.stringify([
        baseHabit,
        {
          ...baseHabit,
          id: 'habit-2',
          userId: 'user-2',
          name: 'Read Books',
        },
      ])
    );

    expect(getHabitsForUser('user-1')).toEqual([baseHabit]);
  });

  it('creates a habit and stores it for the user', () => {
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('habit-2');

    const createdHabit = createHabit('user-1', {
      name: 'Read Books',
      description: 'Ten pages',
      frequency: 'daily',
    });

    expect(createdHabit).toMatchObject({
      id: 'habit-2',
      userId: 'user-1',
      name: 'Read Books',
      description: 'Ten pages',
      frequency: 'daily',
    });
    expect(getStoredHabits()).toHaveLength(1);
  });

  it('updates a stored habit in place', () => {
    localStorage.setItem('habit-tracker-habits', JSON.stringify([baseHabit]));

    updateHabit({
      ...baseHabit,
      name: 'Read Books',
    });

    expect(getStoredHabits()[0].name).toBe('Read Books');
  });

  it('deletes a stored habit by id', () => {
    localStorage.setItem('habit-tracker-habits', JSON.stringify([baseHabit]));

    deleteHabit(baseHabit.id);

    expect(getStoredHabits()).toEqual([]);
  });

  it('toggles a stored habit completion for a specific date', () => {
    localStorage.setItem('habit-tracker-habits', JSON.stringify([baseHabit]));

    const updatedHabit = toggleHabitForDate(baseHabit, '2026-04-25');

    expect(updatedHabit.completions).toEqual(['2026-04-25']);
    expect(getStoredHabits()[0].completions).toEqual(['2026-04-25']);
  });
});

describe('constants', () => {
  it('exposes the expected application routes and splash delay', () => {
    expect(ROUTES).toEqual({
      home: '/',
      login: '/login',
      signup: '/signup',
      dashboard: '/dashboard',
    });
    expect(SPLASH_DELAY_MS).toBe(1000);
  });
});

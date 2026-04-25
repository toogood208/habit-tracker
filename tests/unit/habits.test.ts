import { describe, expect, it } from 'vitest';

import { toggleHabitCompletion } from '@/lib/habits';
import type { Habit } from '@/types/habit';

describe('toggleHabitCompletion', () => {
  const baseHabit: Habit = {
    id: 'habit-1',
    userId: 'user-1',
    name: 'Drink Water',
    description: 'Drink 8 glasses',
    frequency: 'daily',
    createdAt: '2026-04-25T10:00:00.000Z',
    completions: [],
  };

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
});

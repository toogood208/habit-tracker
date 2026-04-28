import type { Habit } from '@/types/habit';

import { getStoredHabits, setStoredHabits } from '@/lib/storage';

type HabitFormValues = {
  name: string;
  description: string;
  frequency: 'daily';
};

export function getHabitsForUser(userId: string): Habit[] {
  return getStoredHabits().filter((habit) => habit.userId === userId);
}

export function createHabit(userId: string, values: HabitFormValues): Habit {
  const newHabit: Habit = {
    id: crypto.randomUUID(),
    userId,
    name: values.name,
    description: values.description,
    frequency: values.frequency,
    createdAt: new Date().toISOString(),
    completions: [],
  };

  setStoredHabits([...getStoredHabits(), newHabit]);
  return newHabit;
}

export function updateHabit(updatedHabit: Habit): Habit {
  const nextHabits = getStoredHabits().map((habit) =>
    habit.id === updatedHabit.id ? updatedHabit : habit
  );

  setStoredHabits(nextHabits);
  return updatedHabit;
}

export function deleteHabit(habitId: string): void {
  const nextHabits = getStoredHabits().filter((habit) => habit.id !== habitId);
  setStoredHabits(nextHabits);
}

export function toggleHabitForDate(habit: Habit, date: string): Habit {
  const nextHabit = toggleHabitCompletion(habit, date);
  const nextHabits = getStoredHabits().map((storedHabit) =>
    storedHabit.id === habit.id ? nextHabit : storedHabit
  );

  setStoredHabits(nextHabits);
  return nextHabit;
}

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const completions = new Set(habit.completions);

  if (completions.has(date)) {
    completions.delete(date);
  } else {
    completions.add(date);
  }

  return {
    ...habit,
    completions: [...completions].sort(),
  };
}

'use client';

import { useMemo, useState } from 'react';

import { toggleHabitCompletion } from '@/lib/habits';
import { getStoredHabits, setStoredHabits } from '@/lib/storage';
import type { Habit } from '@/types/habit';

type CreateHabitValues = {
  name: string;
  description: string;
  frequency: 'daily';
};

export default function useUserHabits(userId: string | null) {
  const [refreshKey, setRefreshKey] = useState(0);

  const habits = useMemo(() => {
    if (!userId) {
      return [];
    }

    const allHabits = getStoredHabits();
    return allHabits.filter((habit) => habit.userId === userId);
  }, [refreshKey, userId]);

  function refreshHabits() {
    setRefreshKey((current) => current + 1);
  }

  function createHabit(values: CreateHabitValues) {
    if (!userId) {
      return;
    }

    const allHabits = getStoredHabits();

    const newHabit: Habit = {
      id: crypto.randomUUID(),
      userId,
      name: values.name,
      description: values.description,
      frequency: values.frequency,
      createdAt: new Date().toISOString(),
      completions: [],
    };

    setStoredHabits([...allHabits, newHabit]);
    refreshHabits();
  }

  function updateHabit(updatedHabit: Habit) {
    if (!userId) {
      return;
    }

    const allHabits = getStoredHabits();
    const nextHabits = allHabits.map((habit) =>
      habit.id === updatedHabit.id ? updatedHabit : habit
    );

    setStoredHabits(nextHabits);
    refreshHabits();
  }

  function deleteHabit(habitId: string) {
    if (!userId) {
      return;
    }

    const allHabits = getStoredHabits();
    const nextHabits = allHabits.filter((habit) => habit.id !== habitId);

    setStoredHabits(nextHabits);
    refreshHabits();
  }

  function toggleHabitForDate(habit: Habit, date: string) {
    if (!userId) {
      return;
    }

    const allHabits = getStoredHabits();
    const nextHabits = allHabits.map((storedHabit) => {
      if (storedHabit.id !== habit.id) {
        return storedHabit;
      }

      return toggleHabitCompletion(storedHabit, date);
    });

    setStoredHabits(nextHabits);
    refreshHabits();
  }


  return {
    habits,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabitForDate,
    refreshHabits,
  };
}

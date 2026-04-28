'use client';

import HabitCard from '@/components/habits/HabitCard';
import type { Habit } from '@/types/habit';

type HabitListProps = {
  habits: Habit[];
  onToggleComplete: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
};

export default function HabitList({
  habits,
  onToggleComplete,
  onEdit,
  onDelete,
}: HabitListProps) {
  return (
    <section className="space-y-4">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
}

'use client';

import Button from '@/components/shared/Button';
import { calculateCurrentStreak } from '@/lib/streaks';
import { getHabitSlug } from '@/lib/slug';
import type { Habit } from '@/types/habit';

type HabitCardProps = {
  habit: Habit;
  onToggleComplete: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
};

export default function HabitCard({
  habit,
  onToggleComplete,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const slug = getHabitSlug(habit.name);
  const today = new Date().toISOString().slice(0, 10);
  const isCompletedToday = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit.completions, today);

  return (
    <article
      data-testid={`habit-card-${slug}`}
      className={`rounded-2xl border p-5 shadow-sm transition ${
        isCompletedToday
          ? 'border-emerald-300 bg-emerald-50'
          : 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">{habit.name}</h2>
          <p className="text-sm text-slate-600">
            {habit.description || 'No description'}
          </p>
          {isCompletedToday ? (
            <p className="text-xs font-medium text-emerald-700">
              Completed today
            </p>
          ) : null}
          <p
            data-testid={`habit-streak-${slug}`}
            className="text-sm font-medium text-slate-700"
          >
            Current streak: {streak}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:w-48">
          <Button
            type="button"
            testId={`habit-complete-${slug}`}
            variant={isCompletedToday ? 'secondary' : 'primary'}
            onClick={() => onToggleComplete(habit)}
          >
            {isCompletedToday ? 'Completed Today' : 'Mark Complete'}
          </Button>

          <Button
            type="button"
            testId={`habit-edit-${slug}`}
            variant="secondary"
            fullWidth={false}
            onClick={() => onEdit(habit)}
          >
            Edit
          </Button>

          <Button
            type="button"
            testId={`habit-delete-${slug}`}
            variant="danger"
            fullWidth={false}
            onClick={() => onDelete(habit)}
          >
            Delete
          </Button>
        </div>
      </div>
    </article>
  );
}

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
      className={`rounded-[2rem] border p-5 shadow-[0_20px_50px_rgba(61,45,29,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(61,45,29,0.14)] ${
        isCompletedToday
          ? 'border-emerald-300 bg-[linear-gradient(180deg,#f5fff4,#eaf7e8)] hover:border-emerald-400'
          : 'border-[#dfd2bd] bg-[rgba(255,251,245,0.92)] hover:border-[#c9a37a] hover:bg-[rgba(255,249,240,0.98)]'
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#a1643d]">
            Daily habit
          </p>
          <h2 className="text-xl font-black tracking-tight text-[#1d2430]">{habit.name}</h2>
          <p className="text-sm text-[#6d5a48]">
            {habit.description || 'No description'}
          </p>
          {isCompletedToday ? (
            <p className="inline-flex rounded-full bg-[#dff2dd] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
              Completed today
            </p>
          ) : null}
          <p
            data-testid={`habit-streak-${slug}`}
            className="text-sm font-semibold tracking-[0.04em] text-[#355553]"
          >
            Current streak: {streak}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Button
            type="button"
            testId={`habit-complete-${slug}`}
            variant={isCompletedToday ? 'secondary' : 'success'}
            fullWidth={false}
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

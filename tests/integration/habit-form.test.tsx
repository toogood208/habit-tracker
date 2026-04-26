import { useState } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import HabitCard from '@/components/habits/HabitCard';
import HabitForm from '@/components/habits/HabitForm';
import useUserHabits from '@/hooks/useUserHabits';
import {
  HABITS_STORAGE_KEY,
  SESSION_STORAGE_KEY,
} from '@/lib/storage';
import type { Habit } from '@/types/habit';

function TestDashboardHarness() {
  const userHabits = useUserHabits('user-1');
  const [isCreating, setIsCreating] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);

  function handleToggleComplete(habit: Habit) {
    const today = new Date().toISOString().slice(0, 10);
    userHabits.toggleHabitForDate(habit, today);
  }

  function handleEditHabit(habit: Habit) {
    setIsCreating(false);
    setEditingHabit(habit);
  }

  function handleDeleteHabit(habit: Habit) {
    setIsCreating(false);
    setEditingHabit(null);
    setDeletingHabit(habit);
  }

  return (
    <main data-testid="dashboard-page">
      <button
        type="button"
        data-testid="create-habit-button"
        onClick={() => {
          setEditingHabit(null);
          setIsCreating(true);
        }}
      >
        Create Habit
      </button>

      {isCreating ? (
        <HabitForm
          onSave={(values) => {
            userHabits.createHabit(values);
            setIsCreating(false);
          }}
          onCancel={() => setIsCreating(false)}
        />
      ) : null}

      {editingHabit ? (
        <HabitForm
          initialValues={{
            name: editingHabit.name,
            description: editingHabit.description,
            frequency: editingHabit.frequency,
          }}
          submitLabel="Update Habit"
          onSave={(values) => {
            userHabits.updateHabit({
              ...editingHabit,
              name: values.name,
              description: values.description,
              frequency: values.frequency,
            });
            setEditingHabit(null);
          }}
          onCancel={() => setEditingHabit(null)}
        />
      ) : null}

      {deletingHabit ? (
        <section>
          <button
            type="button"
            data-testid="confirm-delete-button"
            onClick={() => {
              userHabits.deleteHabit(deletingHabit.id);
              setDeletingHabit(null);
            }}
          >
            Confirm Delete
          </button>
        </section>
      ) : null}

      {userHabits.habits.length === 0 ? (
        <section data-testid="empty-state">No habits yet</section>
      ) : (
        <section>
          {userHabits.habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditHabit}
              onDelete={handleDeleteHabit}
            />
          ))}
        </section>
      )}
    </main>
  );
}

describe('habit form', () => {
  beforeEach(() => {
    localStorage.clear();

    localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        userId: 'user-1',
        email: 'test@example.com',
      })
    );
  });

  it('shows a validation error when habit name is empty', async () => {
    render(<TestDashboardHarness />);

    fireEvent.click(screen.getByTestId('create-habit-button'));
    fireEvent.click(screen.getByTestId('habit-save-button'));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Habit name is required'
    );
  });

  it('creates a new habit and renders it in the list', async () => {
    render(<TestDashboardHarness />);

    fireEvent.click(screen.getByTestId('create-habit-button'));

    fireEvent.change(screen.getByTestId('habit-name-input'), {
      target: { value: 'Drink Water' },
    });
    fireEvent.change(screen.getByTestId('habit-description-input'), {
      target: { value: 'Eight glasses a day' },
    });
    fireEvent.click(screen.getByTestId('habit-save-button'));

    expect(screen.getByTestId('habit-card-drink-water')).toBeInTheDocument();

    const storedHabits = JSON.parse(
      localStorage.getItem(HABITS_STORAGE_KEY) ?? '[]'
    );

    expect(storedHabits).toHaveLength(1);
    expect(storedHabits[0].name).toBe('Drink Water');
    expect(storedHabits[0].userId).toBe('user-1');
  });

  it('edits an existing habit and preserves immutable fields', async () => {
    localStorage.setItem(
      HABITS_STORAGE_KEY,
      JSON.stringify([
        {
          id: 'habit-1',
          userId: 'user-1',
          name: 'Drink Water',
          description: 'Old description',
          frequency: 'daily',
          createdAt: '2026-04-26T10:00:00.000Z',
          completions: ['2026-04-26'],
        },
      ])
    );

    render(<TestDashboardHarness />);

    fireEvent.click(screen.getByTestId('habit-edit-drink-water'));

    fireEvent.change(screen.getByTestId('habit-name-input'), {
      target: { value: 'Read Books' },
    });
    fireEvent.change(screen.getByTestId('habit-description-input'), {
      target: { value: 'Read 10 pages' },
    });
    fireEvent.click(screen.getByTestId('habit-save-button'));

    const storedHabits = JSON.parse(
      localStorage.getItem(HABITS_STORAGE_KEY) ?? '[]'
    );

    expect(storedHabits[0]).toMatchObject({
      id: 'habit-1',
      userId: 'user-1',
      name: 'Read Books',
      description: 'Read 10 pages',
      frequency: 'daily',
      createdAt: '2026-04-26T10:00:00.000Z',
      completions: ['2026-04-26'],
    });

    expect(screen.getByTestId('habit-card-read-books')).toBeInTheDocument();
  });

  it('deletes a habit only after explicit confirmation', async () => {
    localStorage.setItem(
      HABITS_STORAGE_KEY,
      JSON.stringify([
        {
          id: 'habit-1',
          userId: 'user-1',
          name: 'Drink Water',
          description: '',
          frequency: 'daily',
          createdAt: '2026-04-26T10:00:00.000Z',
          completions: [],
        },
      ])
    );

    render(<TestDashboardHarness />);

    fireEvent.click(screen.getByTestId('habit-delete-drink-water'));

    expect(screen.getByTestId('confirm-delete-button')).toBeInTheDocument();
    expect(screen.getByTestId('habit-card-drink-water')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('confirm-delete-button'));

    const storedHabits = JSON.parse(
      localStorage.getItem(HABITS_STORAGE_KEY) ?? '[]'
    );

    expect(storedHabits).toHaveLength(0);
    await waitFor(() => {
      expect(
        screen.queryByTestId('habit-card-drink-water')
      ).not.toBeInTheDocument();
    });
  });

  it('toggles completion and updates the streak display', async () => {
    localStorage.setItem(
      HABITS_STORAGE_KEY,
      JSON.stringify([
        {
          id: 'habit-1',
          userId: 'user-1',
          name: 'Drink Water',
          description: '',
          frequency: 'daily',
          createdAt: '2026-04-26T10:00:00.000Z',
          completions: [],
        },
      ])
    );

    render(<TestDashboardHarness />);

    expect(screen.getByTestId('habit-streak-drink-water')).toHaveTextContent(
      'Current streak: 0'
    );

    fireEvent.click(screen.getByTestId('habit-complete-drink-water'));

    await waitFor(() => {
      expect(screen.getByTestId('habit-streak-drink-water')).toHaveTextContent(
        'Current streak: 1'
      );
    });
  });
});

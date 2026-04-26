import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import DashboardPage from '@/app/dashboard/page';
import {
  HABITS_STORAGE_KEY,
  SESSION_STORAGE_KEY,
} from '@/lib/storage';

const replaceMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: replaceMock,
  }),
}));

describe('habit form', () => {
  beforeEach(() => {
    localStorage.clear();
    replaceMock.mockReset();

    localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        userId: 'user-1',
        email: 'test@example.com',
      })
    );
  });

  it('shows a validation error when habit name is empty', async () => {
    render(<DashboardPage />);

    fireEvent.click(await screen.findByTestId('create-habit-button'));
    fireEvent.click(await screen.findByTestId('habit-save-button'));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Habit name is required'
    );
  });

  it('creates a new habit and renders it in the list', async () => {
    render(<DashboardPage />);

    fireEvent.click(await screen.findByTestId('create-habit-button'));

    fireEvent.change(await screen.findByTestId('habit-name-input'), {
      target: { value: 'Drink Water' },
    });
    fireEvent.change(screen.getByTestId('habit-description-input'), {
      target: { value: 'Eight glasses a day' },
    });
    fireEvent.click(screen.getByTestId('habit-save-button'));

    expect(
      await screen.findByTestId('habit-card-drink-water')
    ).toBeInTheDocument();

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

    render(<DashboardPage />);

    fireEvent.click(await screen.findByTestId('habit-edit-drink-water'));

    fireEvent.change(await screen.findByTestId('habit-name-input'), {
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

    expect(await screen.findByTestId('habit-card-read-books')).toBeInTheDocument();
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

    render(<DashboardPage />);

    fireEvent.click(await screen.findByTestId('habit-delete-drink-water'));

    expect(await screen.findByTestId('confirm-delete-button')).toBeInTheDocument();
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

    render(<DashboardPage />);

    const streakBefore = await screen.findByTestId('habit-streak-drink-water');
    expect(streakBefore).toHaveTextContent('Current streak: 0');

    fireEvent.click(screen.getByTestId('habit-complete-drink-water'));

    await waitFor(() => {
      expect(screen.getByTestId('habit-streak-drink-water')).toHaveTextContent(
        'Current streak: 1'
      );
    });
  });
});

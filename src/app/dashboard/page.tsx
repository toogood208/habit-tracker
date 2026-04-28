'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import HabitForm from '@/components/habits/HabitForm';
import HabitList from '@/components/habits/HabitList';
import Button from '@/components/shared/Button';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { logoutUser } from '@/lib/auth';
import { APP_NAME, ROUTES } from '@/lib/constants';
import {
  createHabit,
  deleteHabit,
  getHabitsForUser,
  toggleHabitForDate,
  updateHabit,
} from '@/lib/habits';
import type { Session } from '@/types/auth';
import type { Habit } from '@/types/habit';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      {(session) => <DashboardContent session={session} />}
    </ProtectedRoute>
  );
}

type DashboardContentProps = {
  session: Session;
};

function DashboardContent({ session }: DashboardContentProps) {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
    const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);

  useEffect(() => {
    setHabits(getHabitsForUser(session.userId));
  }, [session.userId]);

  function refreshHabits() {
    setHabits(getHabitsForUser(session.userId));
  }

  function handleToggleComplete(habit: Habit) {
    const today = new Date().toISOString().slice(0, 10);
    toggleHabitForDate(habit, today);
    refreshHabits();
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

  function handleLogout() {
    logoutUser();
    window.location.href = ROUTES.login;
  }

  function handleOpenCreateHabit() {
    setDeletingHabit(null);
    setEditingHabit(null);
    setIsCreating(true);
  }


    return (
        <main
            data-testid="dashboard-page"
            className="relative min-h-screen overflow-hidden px-6 py-10"
        >
            <div className="app-grid pointer-events-none absolute inset-0 opacity-40" />
            <div className="relative z-10 mx-auto max-w-5xl space-y-6">
                <header className="rounded-[2rem] border border-[#d5bea3] bg-[linear-gradient(180deg,rgba(255,252,247,0.98),rgba(245,235,223,0.94))] px-5 py-4 shadow-[0_26px_60px_rgba(61,45,29,0.18)] backdrop-blur-xl sm:px-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#a1643d]">
                                {APP_NAME}
                            </p>
                            <p className="mt-2 text-sm font-medium text-[#6d5a48]">
                                Signed in as <span className="font-bold text-[#1d2430]">{session.email}</span>
                            </p>
                        </div>

                        <Button
                            type="button"
                            testId="auth-logout-button"
                            variant="secondary"
                            fullWidth={false}
                            onClick={handleLogout}
                        >
                            Log Out
                        </Button>
                    </div>
                </header>

                {habits.length > 0 ? (
                    <section className="flex justify-end">
                        <Button
                            type="button"
                            testId="create-habit-button"
                            variant="primary"
                            fullWidth={false}
                            onClick={handleOpenCreateHabit}
                        >
                            Create Habit
                        </Button>
                    </section>
                ) : null}

                {isCreating ? (
                    <HabitForm
                        key="create-habit"
                        onSave={(values) => {
                            createHabit(session.userId, values);
                            refreshHabits();
                            setIsCreating(false);
                        }}
                        onCancel={() => setIsCreating(false)}
                    />
                ) : null}

                {editingHabit ? (
                    <HabitForm
                        key={`edit-habit-${editingHabit.id}`}
                        initialValues={{
                            name: editingHabit.name,
                            description: editingHabit.description,
                            frequency: editingHabit.frequency,
                        }}
                        submitLabel="Update Habit"
                        onSave={(values) => {
                            updateHabit({
                                ...editingHabit,
                                name: values.name,
                                description: values.description,
                                frequency: values.frequency,
                            });
                            refreshHabits();
                            setEditingHabit(null);
                        }}
                        onCancel={() => setEditingHabit(null)}
                    />
                ) : null}

                {deletingHabit ? (
                    <div className="fixed inset-0 z-30 flex items-center justify-center px-6">
                        <div
                            className="absolute inset-0 bg-[#1d2430]/35 backdrop-blur-[2px]"
                            onClick={() => setDeletingHabit(null)}
                        />
                        <section
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="delete-habit-title"
                            className="relative w-full max-w-md rounded-[2rem] border border-[#dccab3] bg-[linear-gradient(180deg,rgba(255,252,247,0.98),rgba(245,235,223,0.96))] p-6 shadow-[0_28px_70px_rgba(61,45,29,0.2)]"
                        >
                            <h2
                                id="delete-habit-title"
                                className="text-xl font-black tracking-tight text-[#1d2430]"
                            >
                                Delete habit?
                            </h2>
                            <p className="mt-2 text-sm text-[#6d5a48]">
                                Are you sure you want to delete "{deletingHabit.name}"?
                            </p>

                            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                                <Button
                                    type="button"
                                    testId="confirm-delete-button"
                                    variant="danger"
                                    fullWidth={false}
                                    onClick={() => {
                                        deleteHabit(deletingHabit.id);
                                        refreshHabits();
                                        setDeletingHabit(null);
                                    }}
                                >
                                    Confirm Delete
                                </Button>

                                <Button
                                    type="button"
                                    variant="secondary"
                                    fullWidth={false}
                                    onClick={() => setDeletingHabit(null)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </section>
                    </div>
                ) : null}


                {habits.length === 0 && !isCreating ? (
                    <section
                        data-testid="empty-state"
                        className="app-panel mt-8 rounded-[2.5rem] border border-dashed p-8 text-center sm:mt-12"
                    >
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-[#d8c9b2] bg-white/70 shadow-[0_18px_40px_rgba(61,45,29,0.08)]">
                            <Image
                                src="/icons/icon-192.png?v=2"
                                alt="Habit Tracker app icon"
                                width={56}
                                height={56}
                                className="rounded-[1rem]"
                                unoptimized
                            />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight text-[#1d2430]">
                            No habits yet
                        </h2>
                        <p className="mt-3 text-sm text-[#6d5a48]">
                            Create your first habit to start building your streaks.
                        </p>
                        <div className="mt-6 flex justify-center">
                            <Button
                                type="button"
                                testId="create-habit-button"
                                variant="primary"
                                fullWidth={false}
                                onClick={handleOpenCreateHabit}
                            >
                                Create Habit
                            </Button>
                        </div>
                    </section>
                ) : (
                    <HabitList
                        habits={habits}
                        onToggleComplete={handleToggleComplete}
                        onEdit={handleEditHabit}
                        onDelete={handleDeleteHabit}
                    />
                )}
            </div>
        </main>
    );
}

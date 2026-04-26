'use client';

import { useState } from 'react';

import HabitCard from '@/components/habits/HabitCard';
import HabitForm from '@/components/habits/HabitForm';
import Button from '@/components/shared/Button';
import { logoutUser } from '@/lib/auth';
import useProtectedSession from '@/hooks/useProtectedSession';
import useUserHabits from '@/hooks/useUserHabits';
import type { Habit } from '@/types/habit';

export default function DashboardPage() {
    const { isReady, session } = useProtectedSession();
    const userHabits = useUserHabits(session?.userId ?? null);
    const [isCreating, setIsCreating] = useState(false);
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
    const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);


    if (!isReady) {
        return null;
    }

  if (!session) {
    return null;
  }

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

  function handleLogout() {
    logoutUser();
    window.location.href = '/login';
  }


    return (
        <main
            data-testid="dashboard-page"
            className="min-h-screen bg-slate-100 px-6 py-10"
        >
            <div className="mx-auto max-w-3xl space-y-6">
                <div className="rounded-3xl bg-white p-6 shadow-lg">
                    <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Welcome back, {session.email}
                    </p>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <Button
                            type="button"
                            testId="create-habit-button"
                            variant="primary"
                            fullWidth={false}
                            onClick={() => {
                                setEditingHabit(null);
                                setIsCreating(true);
                            }}
                        >
                            Create Habit
                        </Button>

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
                </div>

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
                    <section className="rounded-3xl bg-white p-6 shadow-lg">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Delete habit?
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Are you sure you want to delete "{deletingHabit.name}"?
                        </p>

                        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                            <Button
                                type="button"
                                testId="confirm-delete-button"
                                variant="danger"
                                fullWidth={false}
                                onClick={() => {
                                    userHabits.deleteHabit(deletingHabit.id);
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
                ) : null}


                {userHabits.habits.length === 0 ? (
                    <section
                        data-testid="empty-state"
                        className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm"
                    >
                        <h2 className="text-xl font-semibold text-slate-900">
                            No habits yet
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Create your first habit to start building your streaks.
                        </p>
                    </section>
                ) : (
                    <section className="space-y-4">
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
            </div>
        </main>
    );
}

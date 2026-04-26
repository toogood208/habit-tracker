'use client';

import { useEffect, useRef, useState } from 'react';

import Button from '@/components/shared/Button';
import FeedbackMessage from '@/components/shared/FeedbackMessage';
import TextField from '@/components/shared/TextField';
import { validateHabitName } from '@/lib/validators';

type HabitFormValues = {
  name: string;
  description: string;
  frequency: 'daily';
};

type HabitFormProps = {
  onSave: (values: HabitFormValues) => void;
  onCancel?: () => void;
  initialValues?: HabitFormValues;
  submitLabel?: string;
};

const defaultValues: HabitFormValues = {
  name: '',
  description: '',
  frequency: 'daily',
};

export default function HabitForm({
  onSave,
  onCancel,
  initialValues = defaultValues,
  submitLabel = 'Save Habit',
}: HabitFormProps) {
  const [name, setName] = useState(initialValues.name);
  const [description, setDescription] = useState(initialValues.description);
  const [frequency, setFrequency] = useState<'daily'>(initialValues.frequency);
  const [isFrequencyOpen, setIsFrequencyOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const frequencyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setName(initialValues.name);
    setDescription(initialValues.description);
    setFrequency(initialValues.frequency);
    setError(null);
    setIsFrequencyOpen(false);
  }, [initialValues]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!frequencyRef.current?.contains(event.target as Node)) {
        setIsFrequencyOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = validateHabitName(name);

    if (!result.valid) {
      setError(result.error);
      return;
    }

    setError(null);

    onSave({
      name: result.value,
      description: description.trim(),
      frequency,
    });

    setName(defaultValues.name);
    setDescription(defaultValues.description);
    setFrequency(defaultValues.frequency);
  }

  return (
    <form
      data-testid="habit-form"
      onSubmit={handleSubmit}
      className="app-panel space-y-5 rounded-[2rem] p-6"
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#a1643d]">
          Habit details
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-[#1d2430]">
          {submitLabel === 'Save Habit' ? 'Create a habit' : 'Refine your habit'}
        </h2>
        <p className="mt-2 text-sm text-[#6d5a48]">
          Keep it specific enough to act on and simple enough to repeat.
        </p>
      </div>

      <TextField
        id="habit-name"
        label="Habit name"
        value={name}
        onChange={setName}
        testId="habit-name-input"
        placeholder="Drink water"
      />

      <div className="group">
        <label
          htmlFor="habit-description"
          className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#6c5844]"
        >
          Description
        </label>
        <textarea
          id="habit-description"
          data-testid="habit-description-input"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          className="w-full cursor-text rounded-2xl border border-[#d8c9b2] bg-[#fffdf8] px-4 py-3 text-[#1d2430] caret-[#c7673c] outline-none transition duration-200 group-hover:border-[#c9a37a] group-hover:bg-[#fffaf2] group-hover:shadow-[0_10px_24px_rgba(199,103,60,0.08)] placeholder:text-[#b39f87] focus:border-[#c7673c] focus:bg-[#fffaf2] focus:ring-2 focus:ring-[#e4b47f]"
          placeholder="Optional note about this habit"
        />
      </div>

      <div>
        <label
          htmlFor="habit-frequency"
          className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#6c5844]"
        >
          Frequency
        </label>
        <div ref={frequencyRef} className="group relative">
          <button
            id="habit-frequency"
            data-testid="habit-frequency-select"
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isFrequencyOpen}
            className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-[#d8c9b2] bg-[#fffdf8] px-4 py-3 text-left text-[#1d2430] outline-none transition duration-200 group-hover:border-[#c9a37a] group-hover:bg-[#fffaf2] group-hover:shadow-[0_10px_24px_rgba(199,103,60,0.08)] focus:border-[#c7673c] focus:bg-[#fffaf2] focus:ring-2 focus:ring-[#e4b47f]"
            onClick={() => setIsFrequencyOpen((current) => !current)}
          >
            <span>
              <span className="block text-sm font-semibold text-[#1d2430]">
                Daily cadence
              </span>
              <span className="mt-1 block text-xs text-[#8b745d]">
                Keep one simple rhythm you can repeat every day.
              </span>
            </span>
            <span className="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#f4ecdf] text-[#8b745d]">
              <svg
                aria-hidden="true"
                className={`h-4 w-4 transition ${isFrequencyOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>

          {isFrequencyOpen ? (
            <div
              role="listbox"
              aria-labelledby="habit-frequency"
              className="absolute left-0 right-0 top-[calc(100%+0.65rem)] z-10 rounded-[1.5rem] border border-[#d8c9b2] bg-[#fffaf2] p-2 shadow-[0_20px_45px_rgba(61,45,29,0.12)]"
            >
              <button
                type="button"
                role="option"
                aria-selected={frequency === 'daily'}
                className="w-full rounded-[1rem] bg-[linear-gradient(180deg,#fffdf8,#f7efe2)] px-4 py-3 text-left transition hover:bg-[linear-gradient(180deg,#fdf5ea,#f3e6d2)]"
                onClick={() => {
                  setFrequency('daily');
                  setIsFrequencyOpen(false);
                }}
              >
                <span className="block text-sm font-semibold text-[#1d2430]">
                  Daily cadence
                </span>
                <span className="mt-1 block text-xs text-[#8b745d]">
                  Best for streaks and simple consistency.
                </span>
              </button>
            </div>
          ) : null}
        </div>
        <p className="mt-2 text-xs text-[#8b745d]">
          Daily keeps the routine simple and your streak easy to track.
        </p>
      </div>

      <FeedbackMessage message={error} variant="error" />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" testId="habit-save-button" variant="primary">
          {submitLabel}
        </Button>

        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}

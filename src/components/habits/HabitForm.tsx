'use client';

import { useEffect, useState } from 'react';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(initialValues.name);
    setDescription(initialValues.description);
    setFrequency(initialValues.frequency);
    setError(null);
  }, [initialValues]);

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
      className="space-y-5 rounded-3xl bg-white p-6 shadow-lg"
    >
      <TextField
        id="habit-name"
        label="Habit name"
        value={name}
        onChange={setName}
        testId="habit-name-input"
        placeholder="Drink water"
      />

      <div>
        <label
          htmlFor="habit-description"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Description
        </label>
        <textarea
          id="habit-description"
          data-testid="habit-description-input"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-300"
          placeholder="Optional note about this habit"
        />
      </div>

      <div>
        <label
          htmlFor="habit-frequency"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Frequency
        </label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          value={frequency}
          onChange={(event) => setFrequency(event.target.value as 'daily')}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-300"
        >
          <option value="daily">Daily</option>
        </select>
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

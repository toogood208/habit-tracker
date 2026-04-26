type FeedbackMessageProps = {
  message: string | null;
  variant?: 'error' | 'success' | 'info';
};

const variantClasses = {
  error: 'border border-red-200 bg-red-50 text-red-700',
  success: 'border border-emerald-200 bg-emerald-50 text-emerald-700',
  info: 'border border-sky-200 bg-sky-50 text-sky-700',
};

export default function FeedbackMessage({
  message,
  variant = 'error',
}: FeedbackMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      role="alert"
      className={`rounded-xl px-4 py-3 text-sm ${variantClasses[variant]}`}
    >
      {message}
    </p>
  );
}

type FeedbackMessageProps = {
  message: string | null;
  variant?: 'error' | 'success' | 'info';
};

const variantClasses = {
  error: 'border border-[#e1b0ab] bg-[#fff0ee] text-[#9e3e33]',
  success: 'border border-[#b8d5b6] bg-[#eef7ec] text-[#2d6a36]',
  info: 'border border-[#b6d2dc] bg-[#edf7fa] text-[#215d73]',
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
      className={`rounded-2xl px-4 py-3 text-sm font-medium ${variantClasses[variant]}`}
    >
      {message}
    </p>
  );
}

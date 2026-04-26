import type { ReactNode } from 'react';

type ButtonProps = {
    children: ReactNode;
    type?: 'button' | 'submit' | 'reset';
    testId?: string;
    variant?: 'primary' | 'secondary' | 'danger';
    onClick?: () => void;
    disabled?: boolean;
    fullWidth?: boolean;
};

const variantClasses = {
    primary: 'bg-slate-900 text-white hover:bg-slate-700',
    secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300',
    danger: 'bg-red-600 text-white hover:bg-red-500',
};

export default function Button({
    children,
    type = 'button',
    testId,
    variant = 'primary',
    onClick,
    disabled = false,
    fullWidth = true,
}: ButtonProps) {
    return (
        <button
            type={type}
            data-testid={testId}
            onClick={onClick}
            disabled={disabled}
            className={`${fullWidth ? 'w-full' : ''} rounded-xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]}`}
        >
            {children}
        </button>
    );
}

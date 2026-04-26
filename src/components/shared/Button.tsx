import type { ReactNode } from 'react';

type ButtonProps = {
    children: ReactNode;
    type?: 'button' | 'submit' | 'reset';
    testId?: string;
    variant?: 'primary' | 'secondary' | 'success' | 'danger';
    onClick?: () => void;
    disabled?: boolean;
    fullWidth?: boolean;
};

const variantClasses = {
    primary: 'bg-[linear-gradient(135deg,#183b3a,#285e58)] text-[#fff9f0] hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_16px_30px_rgba(24,59,58,0.22)]',
    secondary: 'bg-[#efe4d3] text-[#3f342a] hover:bg-[#e7d8c2] hover:shadow-[0_12px_24px_rgba(117,85,43,0.12)]',
    success: 'border border-[#e2c7b0] bg-[#f8ede3] text-[#7a5136] hover:-translate-y-0.5 hover:bg-[#f4e4d5] hover:shadow-[0_14px_28px_rgba(122,81,54,0.12)]',
    danger: 'bg-[linear-gradient(135deg,#c24f42,#a52e2e)] text-white hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_16px_30px_rgba(165,46,46,0.2)]',
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
            className={`${fullWidth ? 'w-full' : ''} rounded-2xl px-4 py-3 text-sm font-semibold tracking-[0.01em] transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#d49667] focus:ring-offset-2 focus:ring-offset-[#f8f4ee] disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]}`}
        >
            {children}
        </button>
    );
}

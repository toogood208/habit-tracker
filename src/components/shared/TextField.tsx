import { useState } from 'react';

type TextFieldProps = {
    id: string;
    label: string;
    type?: 'text' | 'email' | 'password';
    value: string;
    onChange: (value: string) => void;
    testId: string;
    placeholder?: string;
    allowPasswordToggle?: boolean;
}

export default function TextField({
    id,
    label,
    type = 'text',
    value,
    onChange,
    testId,
    placeholder,
    allowPasswordToggle = false,
}: TextFieldProps) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isPasswordField = type === 'password' && allowPasswordToggle;
    const inputType = isPasswordField && isPasswordVisible ? 'text' : type;

    return (
        <div>
            <label htmlFor={id}
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#6c5844]">
                {label}
            </label>
            <div className="group relative">
                <input
                    id={id}
                    data-testid={testId}
                    type={inputType}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    className={`w-full cursor-text rounded-2xl border border-[#d8c9b2] bg-[#fffdf8] px-4 py-3 text-[#1d2430] caret-[#c7673c] outline-none transition duration-200 placeholder:text-[#b39f87] group-hover:border-[#c9a37a] group-hover:bg-[#fffaf2] group-hover:shadow-[0_10px_24px_rgba(199,103,60,0.08)] focus:border-[#c7673c] focus:bg-[#fffaf2] focus:ring-2 focus:ring-[#e4b47f] ${isPasswordField ? 'pr-14' : ''}`}
                />
                {isPasswordField ? (
                    <button
                        type="button"
                        onClick={() => setIsPasswordVisible((current) => !current)}
                        className="absolute inset-y-0 right-4 flex items-center text-xs font-bold uppercase tracking-[0.14em] text-[#8b745d] transition group-hover:text-[#5f4f41] hover:text-[#5f4f41]"
                        aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                    >
                        {isPasswordVisible ? 'Hide' : 'Show'}
                    </button>
                ) : null}
            </div>
        </div>
    );
}

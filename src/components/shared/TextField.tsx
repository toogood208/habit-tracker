type TextFieldProps = {
    id: string;
    label: string;
    type?: 'text' | 'email' | 'password';
    value: string;
    onChange: (value: string) => void;
    testId: string;
    placeholder?: string;
}

export default function TextField({
    id,
    label,
    type = 'text',
    value,
    onChange,
    testId,
    placeholder,
}: TextFieldProps) {
    return (
        <div>
            <label htmlFor={id}
                className="mb-2 block text-sm font-medium text-slate-700">
                {label}
            </label>
            <input
                id={id}
                data-testid={testId}
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-300"
            />
        </div>
    );
}

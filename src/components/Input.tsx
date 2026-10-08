import type { InputType } from "../types/input";

export default function Input({ value, type, setValue, placeholder, label, isRequired }: InputType) {
    return (
        <>
            <label className="block text-sm font-medium text-brand-secondary mb-1">
                {label}
            </label>
            <input
                type={type}
                required={isRequired}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full rounded-md border border-border-primary px-3 py-2 text-brand-secondary placeholder-brand-secondary focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                placeholder={placeholder}
            />
        </>
    )
}
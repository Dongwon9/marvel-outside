import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Input({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  const baseStyles =
    "w-full rounded-lg border px-3 py-2 text-sm transition-all focus:outline-none md:px-4 md:py-2.5 md:text-base";

  const stateStyles = error
    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
    : "border-gray-300 focus:border-transparent focus:ring-2 focus:ring-blue-500";

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-medium md:text-base"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`${baseStyles} ${stateStyles} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600 md:text-sm">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500 md:text-sm">{helperText}</p>
      )}
    </div>
  );
}

import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  description?: string;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, description, required, id, className = "", ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    const descId = description ? `${inputId}-desc` : undefined;
    const errId = error ? `${inputId}-err` : undefined;
    const ariaDescribedBy =
      [descId, errId].filter(Boolean).join(" ") || undefined;

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-navy"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {description && (
          <p id={descId} className="text-xs text-gray-500">
            {description}
          </p>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy}
          className={`
            rounded-lg border px-4 py-3 text-sm text-navy bg-white
            placeholder:text-gray-400
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
            ${error ? "border-red-400 focus:ring-red-400 focus:border-red-400" : "border-gray-300"}
            disabled:bg-gray-50 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        {error && (
          <p id={errId} className="text-xs text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

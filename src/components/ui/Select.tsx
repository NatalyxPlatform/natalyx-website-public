import { forwardRef } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  description?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, options, placeholder, error, description, required, id, className = "", ...props },
    ref
  ) => {
    const selectId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    const descId = description ? `${selectId}-desc` : undefined;
    const errId = error ? `${selectId}-err` : undefined;
    const ariaDescribedBy =
      [descId, errId].filter(Boolean).join(" ") || undefined;

    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={selectId} className="text-sm font-medium text-navy">
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
        <select
          ref={ref}
          id={selectId}
          required={required}
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy}
          className={`
            rounded-lg border px-4 py-3 text-sm text-navy bg-white
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
            ${error ? "border-red-400 focus:ring-red-400 focus:border-red-400" : "border-gray-300"}
            disabled:bg-gray-50 disabled:cursor-not-allowed
            appearance-none cursor-pointer
            bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")] bg-[length:20px_20px] bg-[right_12px_center] bg-no-repeat pr-10
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={errId} className="text-xs text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

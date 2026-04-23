import { forwardRef } from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  description?: string;
  showCharCount?: boolean;
  maxLength?: number;
  currentLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      description,
      required,
      id,
      showCharCount,
      maxLength,
      currentLength = 0,
      className = "",
      ...props
    },
    ref
  ) => {
    const textareaId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    const descId = description ? `${textareaId}-desc` : undefined;
    const errId = error ? `${textareaId}-err` : undefined;
    const ariaDescribedBy =
      [descId, errId].filter(Boolean).join(" ") || undefined;

    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={textareaId} className="text-sm font-medium text-navy">
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
        <textarea
          ref={ref}
          id={textareaId}
          required={required}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy}
          className={`
            rounded-lg border px-4 py-3 text-sm text-navy bg-white
            placeholder:text-gray-400 resize-y min-h-[120px]
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
            ${error ? "border-red-400 focus:ring-red-400 focus:border-red-400" : "border-gray-300"}
            disabled:bg-gray-50 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        <div className="flex justify-between items-center">
          {error ? (
            <p id={errId} className="text-xs text-red-500" role="alert">
              {error}
            </p>
          ) : (
            <span />
          )}
          {showCharCount && maxLength && (
            <p
              className={`text-xs ${currentLength > maxLength * 0.9 ? "text-amber-600" : "text-gray-400"}`}
            >
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

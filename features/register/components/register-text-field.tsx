import type { HTMLInputTypeAttribute } from "react";
import type { RegisterScalarField } from "../model/types";

interface RegisterTextFieldProps {
  field: RegisterScalarField;
  label: string;
  value: string;
  validationError?: string;
  type?: HTMLInputTypeAttribute;
  autoComplete?: string;
  placeholder?: string;
  onValueChange: (field: RegisterScalarField, value: string) => void;
}

export default function RegisterTextField({
  field,
  label,
  value,
  validationError,
  type = "text",
  autoComplete,
  placeholder,
  onValueChange,
}: RegisterTextFieldProps) {
  const errorId = `${field}-error`;

  return (
    <div className="space-y-1.5">
      <label
        className="text-brand block text-sm font-bold"
        htmlFor={field}
      >
        {label}
        <span className="ml-1 text-red-700" aria-hidden="true">
          *
        </span>
        <span className="sr-only"> 필수</span>
      </label>
      <input
        id={field}
        name={field}
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
        aria-invalid={Boolean(validationError)}
        aria-describedby={validationError ? errorId : undefined}
        className={`min-h-11 w-full rounded-lg border bg-white px-4 text-base text-slate-900 outline-none transition-colors duration-200 placeholder:text-slate-400 motion-reduce:transition-none ${
          validationError
            ? "border-red-600 focus:border-red-700 focus:ring-2 focus:ring-red-100"
            : "border-slate-300 hover:border-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-soft"
        }`}
        onChange={(event) => onValueChange(field, event.target.value)}
      />
      {validationError ? (
        <p
          id={errorId}
          role="alert"
          className="text-sm font-medium text-red-700"
        >
          {validationError}
        </p>
      ) : null}
    </div>
  );
}

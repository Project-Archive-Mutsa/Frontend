import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

export const fieldClassName =
  "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-soft disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 motion-reduce:transition-none";

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  helper?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function Field({
  id,
  label,
  required = false,
  helper,
  error,
  children,
  className,
}: FieldProps) {
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-bold text-slate-800">
        {label}
        {required ? (
          <>
            <span aria-hidden="true" className="ml-1 text-red-700">*</span>
            <span className="sr-only"> 필수</span>
          </>
        ) : null}
      </label>
      {helper ? <p id={helperId} className="mt-1 text-xs leading-5 text-slate-500">{helper}</p> : null}
      <div className="mt-2">{children}</div>
      {error ? <p id={errorId} role="alert" className="mt-1.5 text-sm font-medium text-red-700">{error}</p> : null}
    </div>
  );
}

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  helperId?: string;
}

export function TextInput({ error, helperId, className, ...props }: TextInputProps) {
  const errorId = error && props.id ? `${props.id}-error` : undefined;
  return (
    <input
      {...props}
      aria-invalid={Boolean(error)}
      aria-describedby={[helperId, errorId].filter(Boolean).join(" ") || undefined}
      className={`${fieldClassName} ${error ? "border-red-600 focus:border-red-700 focus:ring-red-100" : ""} ${className ?? ""}`}
    />
  );
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  helperId?: string;
}

export function TextArea({ error, helperId, className, ...props }: TextAreaProps) {
  const errorId = error && props.id ? `${props.id}-error` : undefined;
  return (
    <textarea
      {...props}
      aria-invalid={Boolean(error)}
      aria-describedby={[helperId, errorId].filter(Boolean).join(" ") || undefined}
      className={`${fieldClassName} min-h-32 resize-y leading-6 ${error ? "border-red-600 focus:border-red-700 focus:ring-red-100" : ""} ${className ?? ""}`}
    />
  );
}

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export function SelectInput({ error, className, ...props }: SelectInputProps) {
  const errorId = error && props.id ? `${props.id}-error` : undefined;
  return (
    <select
      {...props}
      aria-invalid={Boolean(error)}
      aria-describedby={errorId}
      className={`${fieldClassName} ${error ? "border-red-600 focus:border-red-700 focus:ring-red-100" : ""} ${className ?? ""}`}
    />
  );
}

interface ChoiceListProps {
  id: string;
  legend: string;
  helper?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

export function ChoiceList({ id, legend, helper, required, error, children }: ChoiceListProps) {
  return (
    <fieldset
      id={id}
      tabIndex={-1}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
      className="min-w-0"
    >
      <legend className="text-sm font-bold text-slate-800">
        {legend}
        {required ? (
          <>
            <span aria-hidden="true" className="ml-1 text-red-700">*</span>
            <span className="sr-only"> 필수</span>
          </>
        ) : null}
      </legend>
      {helper ? <p id={`${id}-helper`} className="mt-1 text-xs leading-5 text-slate-500">{helper}</p> : null}
      <div className="mt-3">{children}</div>
      {error ? <p id={`${id}-error`} role="alert" className="mt-2 text-sm font-medium text-red-700">{error}</p> : null}
    </fieldset>
  );
}

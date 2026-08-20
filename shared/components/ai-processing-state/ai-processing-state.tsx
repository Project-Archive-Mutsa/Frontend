import LoadingSpinner from "@/shared/components/loading-spinner/loading-spinner";

interface AiProcessingStateProps {
  title: string;
  description: string;
  items: readonly string[];
  className?: string;
}

export default function AiProcessingState({
  title,
  description,
  items,
  className,
}: AiProcessingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-atomic="true"
      className={`border-y border-slate-300 bg-white px-5 py-7 sm:px-6 ${className ?? ""}`}
    >
      <div className="flex items-start gap-4 text-brand">
        <LoadingSpinner size={24} />
        <div className="min-w-0">
          <p className="font-display text-lg font-bold tracking-[-0.015em] text-slate-950">
            {title}
          </p>
          <p className="mt-2 max-w-3xl text-pretty break-keep text-sm leading-6 text-slate-600">
            {description}
          </p>
        </div>
      </div>

      <ul
        aria-hidden="true"
        className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-3"
      >
        {items.map((item) => (
          <li key={item}>
            <span className="text-xs font-medium text-slate-600">{item}</span>
            <span className="ai-processing-track mt-2 block h-1.5 overflow-hidden bg-brand-soft">
              <span className="ai-processing-scan block h-full w-2/5 bg-brand-accent" />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

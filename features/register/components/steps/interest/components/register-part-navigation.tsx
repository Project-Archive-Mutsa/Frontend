import type { RegisterPart } from "../model/types";

interface RegisterPartNavigationProps {
  parts: RegisterPart[];
  activePartId: number;
  selectedTagIds: number[];
  isDisabled: boolean;
  onPartChange: (partId: number) => void;
}

export default function RegisterPartNavigation({
  parts,
  activePartId,
  selectedTagIds,
  isDisabled,
  onPartChange,
}: RegisterPartNavigationProps) {
  return (
    <>
      <aside className="hidden h-full min-h-0 flex-col overflow-hidden border-r border-slate-200 bg-slate-50 px-3 py-4 text-slate-900 md:flex">
        <h2 className="text-brand text-sm font-bold">파트</h2>

        <ul className="register-scrollbar mt-2 min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
          {parts.map((part) => {
            const isActive = part.partId === activePartId;
            const selectedCount = part.tags.filter((tag) =>
              selectedTagIds.includes(tag.tagId),
            ).length;

            return (
              <li key={part.partId}>
                <button
                  type="button"
                  disabled={isDisabled}
                  aria-pressed={isActive}
                  aria-controls="register-interest-tags"
                  onClick={() => onPartChange(part.partId)}
                  className={`flex min-h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none ${
                    isActive
                      ? "bg-brand-soft text-brand font-semibold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-brand"
                  }`}
                >
                  <span>{part.partName}</span>
                  {selectedCount > 0 ? (
                    <span
                      className={`shrink-0 text-xs font-semibold tabular-nums ${isActive ? "text-brand" : "text-slate-400"}`}
                      aria-label={`${selectedCount}개 선택됨`}
                    >
                      {selectedCount}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <div className="px-8 pt-1 md:hidden">
        <label
          className="text-brand mb-2 block text-sm font-bold"
          htmlFor="register-part"
        >
          관심 파트
        </label>
        <div className="relative">
          <select
            id="register-part"
            value={activePartId}
            disabled={isDisabled}
            onChange={(event) => onPartChange(Number(event.target.value))}
            className="text-brand focus:border-brand-accent focus:ring-brand-soft min-h-11 w-full cursor-pointer appearance-none rounded-lg border border-slate-300 bg-white px-4 pr-11 text-base font-semibold outline-none transition-colors duration-200 hover:border-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
          >
            {parts.map((part) => (
              <option key={part.partId} value={part.partId}>
                {part.partName}
              </option>
            ))}
          </select>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-slate-500"
          >
            <path d="m5.5 7.5 4.5 4.5 4.5-4.5" />
          </svg>
        </div>
      </div>
    </>
  );
}

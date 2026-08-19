import type { RegisterTag } from "../model/types";

interface RegisterInterestTagChipProps {
  tag: RegisterTag;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: (tagId: number) => void;
}

export default function RegisterInterestTagChip({
  tag,
  isSelected,
  isDisabled,
  onToggle,
}: RegisterInterestTagChipProps) {
  const inputId = `register-tag-${tag.tagId}`;

  return (
    <label className="group relative cursor-pointer" htmlFor={inputId}>
      <input
        id={inputId}
        className="peer sr-only"
        name="selectedInterests"
        type="checkbox"
        value={tag.tagId}
        checked={isSelected}
        disabled={isDisabled}
        onChange={() => onToggle(tag.tagId)}
      />
      <span className="group-hover:border-brand-accent group-hover:bg-brand-soft peer-checked:border-brand peer-checked:bg-brand peer-focus-visible:outline-brand-accent inline-flex min-h-9 items-center justify-center rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors duration-200 group-hover:text-brand peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 motion-reduce:transition-none">
        {tag.tagName}
      </span>
    </label>
  );
}

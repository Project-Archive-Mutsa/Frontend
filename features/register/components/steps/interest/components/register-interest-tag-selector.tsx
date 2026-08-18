import type { RegisterInterest } from "../../../../model/types";
import type { RegisterPart } from "../model/types";
import RegisterInterestTagChip from "./register-interest-tag-chip";

interface RegisterInterestTagSelectorProps {
  part: RegisterPart;
  selectedInterests: RegisterInterest[];
  validationError?: string;
  isDisabled: boolean;
  onTagToggle: (tagId: number) => void;
}

export default function RegisterInterestTagSelector({
  part,
  selectedInterests,
  validationError,
  isDisabled,
  onTagToggle,
}: RegisterInterestTagSelectorProps) {
  const descriptionId = "register-interest-description";
  const errorId = "register-interest-error";
  return (
    <section
      id="register-interest-tags"
      className="flex h-full min-w-0 flex-col"
      aria-labelledby="register-interest-title"
    >
      <h2
        id="register-interest-title"
        className="text-brand mb-3 text-base font-bold"
      >
        {part.partName}
      </h2>

      <fieldset
        disabled={isDisabled}
        className="flex min-h-0 flex-1 flex-col"
        aria-describedby={
          validationError ? `${descriptionId} ${errorId}` : descriptionId
        }
      >
        <legend className="sr-only">{part.partName} 관심 태그 선택</legend>

        {part.tags.length > 0 ? (
          <div className="flex min-h-20 flex-wrap content-start gap-2">
            {part.tags.map((tag) => (
              <RegisterInterestTagChip
                key={tag.tagId}
                tag={tag}
                isSelected={selectedInterests.some(
                  (selectedInterest) =>
                    selectedInterest.partId === part.partId &&
                    selectedInterest.tagId === tag.tagId,
                )}
                isDisabled={isDisabled}
                onToggle={onTagToggle}
              />
            ))}
          </div>
        ) : (
          <p className="flex min-h-20 items-center justify-center border border-slate-200 bg-slate-50 px-4 text-center text-sm text-slate-600">
            이 파트에는 선택 가능한 태그가 없습니다.
          </p>
        )}

        {validationError ? (
          <p
            id={errorId}
            role="alert"
            className="mt-1.5 text-xs font-medium text-red-700"
          >
            {validationError}
          </p>
        ) : null}

        <p
          id={descriptionId}
          className="mt-auto pt-3 text-xs leading-5 text-slate-500"
        >
          선택한 관심 분야는 프로젝트 추천과 팀 매칭에 활용됩니다.
        </p>
      </fieldset>
    </section>
  );
}

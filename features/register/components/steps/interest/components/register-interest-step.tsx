import SectionLoadingSpinner from "@/shared/components/section-loading-spinner/section-loading-spinner";
import RegisterActions from "../../../register-actions";
import RegisterStepForm from "../../../register-step-form";
import useRegisterInterestStep from "../hooks/use-register-interest-step";
import RegisterInterestTagSelector from "./register-interest-tag-selector";
import RegisterPartNavigation from "./register-part-navigation";

interface RegisterInterestStepProps {
  selectedTagIds: number[];
  submitError: Error | null;
  isSubmitting: boolean;
  onTagToggle: (tagId: number) => void;
  onPrevious: () => void;
  onComplete: () => void;
}

export default function RegisterInterestStep({
  selectedTagIds,
  submitError,
  isSubmitting,
  onTagToggle,
  onPrevious,
  onComplete,
}: RegisterInterestStepProps) {
  const {
    parts,
    activePart,
    partsError,
    isPartsPending,
    validationErrors,
    selectPart,
    toggleTag,
    submitStep,
  } = useRegisterInterestStep({ selectedTagIds, onTagToggle, onComplete });

  const isPartsUnavailable =
    isPartsPending || Boolean(partsError) || parts.length === 0;

  return (
    <RegisterStepForm
      className="flex h-[28rem] min-h-0 flex-col pt-5"
      onSubmit={submitStep}
    >
      {isPartsPending ? (
        <div className="min-h-0 flex-1 px-8 py-6 2xl:px-10">
          <SectionLoadingSpinner />
        </div>
      ) : partsError ? (
        <div className="mx-8 flex min-h-0 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-6 text-center 2xl:mx-10">
          <p role="alert" className="font-semibold text-red-700">
            {partsError.message}
          </p>
        </div>
      ) : parts.length === 0 || !activePart ? (
        <div className="mx-8 flex min-h-0 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-6 text-center 2xl:mx-10">
          <p className="font-semibold text-slate-600">
            선택 가능한 관심 분야가 없습니다.
          </p>
        </div>
      ) : (
        <div className="min-h-0 flex-1 md:grid md:grid-cols-[11.5rem_minmax(0,1fr)]">
          <RegisterPartNavigation
            parts={parts}
            activePartId={activePart.partId}
            selectedTagIds={selectedTagIds}
            isDisabled={isSubmitting}
            onPartChange={selectPart}
          />
          <div className="register-scrollbar min-h-0 min-w-0 overflow-y-auto px-6 py-4 text-slate-700 2xl:px-8">
            <RegisterInterestTagSelector
              part={activePart}
              selectedTagIds={selectedTagIds}
              validationError={validationErrors.selectedTagIds}
              isDisabled={isSubmitting}
              onTagToggle={toggleTag}
            />
          </div>
        </div>
      )}

      <div className="shrink-0 px-8 pb-6 2xl:px-10">
        {submitError ? (
          <div className="pt-4">
            <p role="alert" className="text-sm font-medium text-red-700">
              {submitError.message}
            </p>
          </div>
        ) : null}

        <RegisterActions
          step={3}
          isSubmitting={isSubmitting}
          isSubmitDisabled={isPartsUnavailable}
          onPrevious={onPrevious}
        />
      </div>
    </RegisterStepForm>
  );
}

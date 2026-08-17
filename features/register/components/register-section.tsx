"use client";

import useRegisterMutation from "../hooks/use-register-mutation";
import useRegisterWizard from "../hooks/use-register-wizard";
import RegisterStepper from "./register-stepper";
import RegisterAccountStep from "./steps/account";
import RegisterInterestStep, {
  usePrefetchSignupParts,
} from "./steps/interest";
import RegisterProfileStep from "./steps/profile";

const registerStepDescriptions = {
  1: "계정 만들기",
  2: "기본 정보 입력",
  3: "관심 분야를 선택해 주세요",
} as const;

export default function RegisterSection() {
  const {
    step,
    values,
    goToNextStep,
    goToPreviousStep,
    toggleTag,
    updateField,
  } = useRegisterWizard();

  const { submitRegister, submitError, isSubmitting, resetSubmit } =
    useRegisterMutation();
  const { prefetchSignupParts } = usePrefetchSignupParts();

  function handleAccountNext() {
    void prefetchSignupParts();
    goToNextStep();
  }

  function handlePreviousStep() {
    resetSubmit();
    goToPreviousStep();
  }

  function handleTagToggle(tagId: number) {
    resetSubmit();
    toggleTag(tagId);
  }

  return (
    <section
      className="relative mx-auto w-full max-w-4xl"
      aria-labelledby="register-title"
    >
      <header className="absolute inset-x-0 bottom-full mb-4 text-center">
        <h1
          id="register-title"
          className="text-brand text-3xl font-bold tracking-[-0.03em]"
        >
          회원가입
        </h1>
        <p className="mt-1.5 text-base font-semibold text-slate-600">
          {registerStepDescriptions[step]}
        </p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="px-8 pt-6 2xl:px-10 2xl:pt-7">
          <RegisterStepper currentStep={step} />
        </div>

        {step === 1 ? (
          <RegisterAccountStep
            values={values}
            onValueChange={updateField}
            onNext={handleAccountNext}
          />
        ) : null}

        {step === 2 ? (
          <RegisterProfileStep
            values={values}
            onValueChange={updateField}
            onNext={goToNextStep}
            onPrevious={handlePreviousStep}
          />
        ) : null}

        {step === 3 ? (
          <RegisterInterestStep
            selectedTagIds={values.selectedTagIds}
            submitError={submitError}
            isSubmitting={isSubmitting}
            onTagToggle={handleTagToggle}
            onPrevious={handlePreviousStep}
            onComplete={() => submitRegister(values)}
          />
        ) : null}
      </div>
    </section>
  );
}

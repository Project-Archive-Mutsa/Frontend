import type { RegisterStep } from "../model/types";

interface RegisterStepperProps {
  currentStep: RegisterStep;
}

const registerSteps = [
  { step: 1, label: "계정 정보" },
  { step: 2, label: "기본 정보" },
  { step: 3, label: "관심 분야" },
] as const;

export default function RegisterStepper({
  currentStep,
}: RegisterStepperProps) {
  return (
    <nav aria-label="회원가입 진행 단계">
      <ol className="mx-auto flex w-full max-w-sm items-center">
        {registerSteps.map(({ step, label }, index) => (
          <li
            key={step}
            className={`flex items-center ${index < registerSteps.length - 1 ? "flex-1" : ""}`}
          >
            <span
              aria-current={currentStep === step ? "step" : undefined}
              aria-label={`${step}단계 ${label}`}
              className={`flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold tabular-nums transition-colors duration-200 motion-reduce:transition-none ${
                currentStep === step
                  ? "border-brand bg-brand text-white"
                  : currentStep > step
                    ? "border-brand bg-brand text-white"
                    : "border-slate-200 bg-slate-100 text-slate-500"
              }`}
            >
              {step}
              <span className="sr-only"> {label}</span>
            </span>
            {index < registerSteps.length - 1 ? (
              <span
                aria-hidden="true"
                className={`mx-4 h-px min-w-8 flex-1 ${currentStep > step ? "bg-brand" : "bg-slate-300"}`}
              />
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

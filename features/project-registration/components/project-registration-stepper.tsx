import { projectRegistrationSteps } from "../model/options";
import type { ProjectRegistrationStep } from "../model/types";

interface ProjectRegistrationStepperProps {
  currentStep: ProjectRegistrationStep;
  onStepChange: (step: ProjectRegistrationStep) => void;
}

export default function ProjectRegistrationStepper({
  currentStep,
  onStepChange,
}: ProjectRegistrationStepperProps) {
  return (
    <nav aria-label="프로젝트 등록 진행 단계" className="lg:sticky lg:top-28">
      <p className="border-b border-slate-300 pb-4 text-sm font-bold text-slate-900">
        프로젝트 등록
      </p>
      <ol className="mt-2">
        {projectRegistrationSteps.map(({ step, label }) => {
          const isCurrent = step === currentStep;
          const isAvailable = step <= currentStep;
          return (
            <li key={step} className="border-b border-slate-200">
              <button
                type="button"
                disabled={!isAvailable}
                aria-current={isCurrent ? "step" : undefined}
                onClick={() => onStepChange(step)}
                className={`flex min-h-14 w-full items-center gap-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed motion-reduce:transition-none ${
                  isCurrent
                    ? "font-bold text-brand"
                    : isAvailable
                      ? "text-slate-700 hover:text-brand"
                      : "text-slate-400"
                }`}
              >
                <span className="w-5 shrink-0 text-xs tabular-nums" aria-hidden="true">
                  {String(step).padStart(2, "0")}
                </span>
                <span className={isCurrent ? "underline decoration-brand-accent decoration-2 underline-offset-4" : ""}>
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

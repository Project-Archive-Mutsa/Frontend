import Link from "next/link";
import type { RegisterStep } from "../model/types";
import LoadingSpinner from "@/shared/components/loading-spinner/loading-spinner";

interface RegisterActionsProps {
  step: RegisterStep;
  isSubmitting: boolean;
  isSubmitDisabled?: boolean;
  onPrevious?: () => void;
}

export default function RegisterActions({
  step,
  isSubmitting,
  isSubmitDisabled = false,
  onPrevious,
}: RegisterActionsProps) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6 border-t border-slate-200 pt-4">
      <div>
        {step === 1 ? (
          <p className="text-sm leading-6 text-slate-600">
            이미 계정이 있나요?{" "}
            <Link
              href="/login"
              className="text-brand hover:text-brand-accent inline-flex min-h-8 cursor-pointer items-center font-bold underline decoration-2 underline-offset-4 transition-colors focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
            >
              로그인
            </Link>
          </p>
        ) : onPrevious ? (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onPrevious}
            className="text-brand min-h-11 min-w-28 cursor-pointer rounded-lg border border-slate-300 bg-white px-5 text-sm font-bold transition-colors duration-200 hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
          >
            이전 단계
          </button>
        ) : null}
      </div>
      <button
        type="submit"
        disabled={isSubmitting || isSubmitDisabled}
        aria-busy={isSubmitting}
        className="bg-brand hover:bg-brand-hover inline-flex min-h-11 min-w-36 cursor-pointer items-center justify-center gap-2 rounded-lg px-6 text-sm font-bold text-white transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 motion-reduce:transition-none"
      >
        {isSubmitting ? (
          <>
            <LoadingSpinner size={20} />
            <span>회원가입 처리 중</span>
          </>
        ) : step === 3 ? (
          "회원가입 완료"
        ) : (
          "다음 단계"
        )}
      </button>
    </div>
  );
}

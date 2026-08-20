import type { PointBalance } from "../api/mypage-api";
import SectionLoadingSpinner from "@/shared/components/section-loading-spinner/section-loading-spinner";

interface PointBalanceSummaryProps {
  balance: PointBalance | undefined;
  errorMessage: string | null;
  isPending: boolean;
  onRetry: () => void;
}

export default function PointBalanceSummary({
  balance,
  errorMessage,
  isPending,
  onRetry,
}: PointBalanceSummaryProps) {
  return (
    <section
      aria-labelledby="point-balance-title"
      className="border-t border-slate-200 bg-slate-50 p-6 sm:p-8 lg:border-t-0 lg:border-l"
    >
      <h2
        id="point-balance-title"
        className="font-display text-xl font-bold tracking-[-0.02em] text-slate-950"
      >
        보유 포인트
      </h2>

      {isPending ? (
        <SectionLoadingSpinner />
      ) : errorMessage ? (
        <div className="mt-5 border-y border-red-200 py-5">
          <p role="alert" className="text-sm leading-6 text-red-800">
            {errorMessage}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 min-h-10 text-sm font-bold text-brand underline decoration-brand-accent underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
          >
            잔액 다시 불러오기
          </button>
        </div>
      ) : balance ? (
        <dl className="mt-5 divide-y divide-slate-200 border-y border-slate-300">
          <div className="flex items-end justify-between gap-5 py-5">
            <dt className="text-sm text-slate-600">총 보유 포인트</dt>
            <dd className="text-2xl font-bold tabular-nums text-slate-950">
              {balance.totalPoint.toLocaleString("ko-KR")} P
            </dd>
          </div>
          <div className="flex items-end justify-between gap-5 py-5">
            <dt className="text-sm text-slate-600">사용 가능 포인트</dt>
            <dd className="text-2xl font-bold tabular-nums text-brand">
              {balance.availablePoint.toLocaleString("ko-KR")} P
            </dd>
          </div>
        </dl>
      ) : null}
    </section>
  );
}

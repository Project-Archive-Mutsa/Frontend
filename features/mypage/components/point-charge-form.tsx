"use client";

import LoadingSpinner from "@/shared/components/loading-spinner/loading-spinner";

const quickAmounts = [100, 1_000, 10_000] as const;

interface PointChargeFormProps {
  amount: string;
  errorMessage: string | null;
  isPending: boolean;
  onAmountChange: (amount: string) => void;
  onSubmit: () => void;
  successMessage: string | null;
}

export default function PointChargeForm({
  amount,
  errorMessage,
  isPending,
  onAmountChange,
  onSubmit,
  successMessage,
}: PointChargeFormProps) {
  const numericAmount = Number(amount);
  const isValidAmount =
    amount.length > 0 &&
    Number.isSafeInteger(numericAmount) &&
    numericAmount > 0;

  return (
    <section aria-labelledby="point-charge-title" className="p-6 sm:p-8">
      <h2
        id="point-charge-title"
        className="font-display text-xl font-bold tracking-[-0.02em] text-slate-950"
      >
        테스트 포인트 충전
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
        현재는 해커톤 시연용 테스트 포인트이며 실제 결제는 발생하지
        않습니다. 정식 운영에서는 별도 결제수단과 충전 정책을 연동할
        예정입니다.
      </p>

      <form
        className="mt-6"
        onSubmit={(event) => {
          event.preventDefault();
          if (isValidAmount) onSubmit();
        }}
      >
        <label
          htmlFor="point-charge-amount"
          className="text-sm font-bold text-slate-800"
        >
          충전할 포인트
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="point-charge-amount"
            aria-describedby="point-charge-help"
            autoComplete="off"
            className="h-12 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 text-right text-base tabular-nums text-slate-950 outline-none transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-soft disabled:cursor-not-allowed disabled:bg-slate-100 motion-reduce:transition-none"
            disabled={isPending}
            inputMode="numeric"
            onChange={(event) =>
              onAmountChange(event.target.value.replace(/\D/g, ""))
            }
            placeholder="1 이상의 정수 포인트"
            value={amount}
          />
          <button
            type="submit"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-brand px-6 text-sm font-bold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 motion-reduce:transition-none"
            disabled={!isValidAmount || isPending}
          >
            {isPending ? <LoadingSpinner size={18} /> : null}
            {isPending ? "충전 중" : "충전하기"}
          </button>
        </div>
        <p id="point-charge-help" className="mt-2 text-xs text-slate-500">
          충전할 만큼의 테스트 포인트를 직접 입력하거나 아래 금액을 선택하세요.
        </p>

        <div className="mt-4 flex flex-wrap gap-2" aria-label="빠른 금액 선택">
          {quickAmounts.map((quickAmount) => (
            <button
              key={quickAmount}
              type="button"
              className="min-h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold tabular-nums text-brand transition-colors hover:border-brand-accent hover:bg-brand-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
              disabled={isPending}
              onClick={() => onAmountChange(String(quickAmount))}
            >
              {quickAmount.toLocaleString("ko-KR")} P
            </button>
          ))}
        </div>

        <div className="mt-4 min-h-6" aria-live="polite">
          {errorMessage ? (
            <p role="alert" className="text-sm font-medium text-red-700">
              {errorMessage}
            </p>
          ) : null}
          {successMessage ? (
            <p className="text-sm font-medium text-emerald-700">
              {successMessage}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  );
}

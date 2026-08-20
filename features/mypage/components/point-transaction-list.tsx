import Link from "next/link";
import type { PointTransaction } from "../api/mypage-api";
import {
  formatPointTransactionDate,
  getPointTransactionTypeLabel,
} from "../model/point-transaction";
import SectionLoadingSpinner from "@/shared/components/section-loading-spinner/section-loading-spinner";

interface PointTransactionListProps {
  errorMessage: string | null;
  isPending: boolean;
  onRetry: () => void;
  transactions: PointTransaction[] | undefined;
}

export default function PointTransactionList({
  errorMessage,
  isPending,
  onRetry,
  transactions,
}: PointTransactionListProps) {
  if (isPending) {
    return <SectionLoadingSpinner />;
  }

  if (errorMessage) {
    return (
      <div className="mt-5 border-y border-red-200 bg-white px-5 py-6">
        <p role="alert" className="text-sm leading-6 text-red-800">
          거래내역을 불러오지 못했습니다. 잔액 조회와 포인트 충전은 계속
          이용할 수 있습니다.
        </p>
        <p className="mt-1 text-xs text-red-700">{errorMessage}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 min-h-10 text-sm font-bold text-brand underline decoration-brand-accent underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
        >
          거래내역 다시 불러오기
        </button>
      </div>
    );
  }

  if (!transactions?.length) {
    return (
      <p className="mt-5 border-y border-slate-300 bg-white px-5 py-10 text-center text-sm text-slate-500">
        아직 거래내역이 없습니다.
      </p>
    );
  }

  return (
    <ol className="mt-5 divide-y divide-slate-200 border-y border-slate-300 bg-white">
      {transactions.map((transaction) => {
        const label = getPointTransactionTypeLabel(transaction.type);

        return (
          <li
            key={transaction.transactionId}
            className="grid gap-4 px-5 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
          >
            <div className="min-w-0">
              <p className="font-bold text-slate-950">
                {transaction.projectName ?? label}
              </p>
              <p className="mt-1 text-sm text-slate-600">{label}</p>
              <time
                dateTime={transaction.createdAt}
                className="mt-2 block text-xs tabular-nums text-slate-500"
              >
                {formatPointTransactionDate(transaction.createdAt)}
              </time>
              {transaction.projectId ? (
                <Link
                  href={`/projects/${transaction.projectId}`}
                  className="mt-3 inline-flex min-h-9 items-center text-xs font-bold text-brand underline decoration-brand-accent underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
                >
                  프로젝트 상세 보기
                </Link>
              ) : null}
            </div>
            <strong
              className={`text-lg tabular-nums ${
                transaction.amount >= 0
                  ? "text-emerald-700"
                  : "text-red-700"
              }`}
            >
              {transaction.amount >= 0 ? "+" : ""}
              {transaction.amount.toLocaleString("ko-KR")} P
            </strong>
          </li>
        );
      })}
    </ol>
  );
}

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { getMyPointBalance } from "../api/get-my-point-balance";
import { getProjectReportAccess } from "../api/get-project-report-access";
import { purchaseProjectReport } from "../api/purchase-project-report";
import useAuthSession from "@/shared/auth/hooks/use-auth-session";
import LoadingSpinner from "@/shared/components/loading-spinner/loading-spinner";
import PurchaseConfirmationDialog from "@/shared/components/purchase-confirmation-dialog/purchase-confirmation-dialog";
import { REPORT_ACCESS_PRICE_POINT } from "@/shared/project-report/report-policy";
import { queryKeys } from "@/shared/query/query-keys";

interface Props {
  projectId: number;
  projectName: string;
  offer: { available: boolean };
}

function InlineLoadingState({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2" role="status">
      <LoadingSpinner size={14} />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export default function ProjectReportAccessPanel({
  projectId,
  projectName,
  offer,
}: Props) {
  const { user, isInitialized } = useAuthSession();
  const queryClient = useQueryClient();
  const [dialog, setDialog] = useState<{ key: string } | null>(null);
  const accessQuery = useQuery({
    queryKey: queryKeys.projects.reportAccess(projectId),
    queryFn: ({ signal }) => getProjectReportAccess(projectId, signal),
    enabled: Boolean(user),
    retry: false,
  });
  const access = accessQuery.data;
  const hasAccess = access?.status === "GRANTED" || access?.status === "OWNER";
  const reportUnavailable =
    !offer.available || access?.status === "UNAVAILABLE";
  const shouldLoadBalance = Boolean(
    user && offer.available && !hasAccess && access?.status !== "UNAVAILABLE",
  );
  const balanceQuery = useQuery({
    queryKey: queryKeys.points.balance,
    queryFn: ({ signal }) => getMyPointBalance(signal),
    enabled: shouldLoadBalance,
    retry: false,
  });
  const purchaseMutation = useMutation({
    mutationFn: (key: string) => purchaseProjectReport(projectId, key),
    retry: false,
    onSuccess: async () => {
      setDialog(null);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.projects.reportAccess(projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.projects.report(projectId),
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.points.balance }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.points.transactions,
        }),
      ]);
    },
  });
  const balance = balanceQuery.data?.availablePoint ?? null;
  const insufficient =
    balance !== null && balance < REPORT_ACCESS_PRICE_POINT;
  const isAccessChecking = Boolean(
    user && accessQuery.isPending && accessQuery.fetchStatus === "fetching",
  );
  const isBalanceChecking = Boolean(
    shouldLoadBalance &&
      balanceQuery.isPending &&
      balanceQuery.fetchStatus === "fetching",
  );
  const isRetrying = accessQuery.isFetching || balanceQuery.isFetching;
  const accessError = accessQuery.isError ? accessQuery.error : null;
  const balanceError =
    shouldLoadBalance && balanceQuery.isError ? balanceQuery.error : null;

  const retryAccessState = () => {
    void accessQuery.refetch();
    if (shouldLoadBalance) void balanceQuery.refetch();
  };

  if (isInitialized && !hasAccess && reportUnavailable) {
    return null;
  }

  return (
    <aside
      aria-labelledby="detailed-info-access-title"
      className="border-y border-slate-300 bg-white px-5 py-6"
    >
      <p className="text-xs font-bold text-brand">프로젝트 상세 정보</p>
      <h2
        id="detailed-info-access-title"
        className="font-display mt-2 text-xl font-bold text-slate-950"
      >
        프로젝트 상세 정보 보기
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        문제 상황, 해결 방법, 검증 결과, 제약·한계와 등록 자산을 확인하는
        열람권입니다. 자산의 사용권이나 소유권은 포함되지 않습니다.
      </p>
      <dl className="mt-6 space-y-4 border-t border-slate-200 pt-5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">열람 상태</dt>
          <dd className="font-bold text-slate-900">
            {!isInitialized || isAccessChecking ? (
              <InlineLoadingState label="열람 상태를 확인하는 중입니다." />
            ) : hasAccess ? (
              access?.status === "OWNER" ? (
                "등록자 열람"
              ) : (
                "열람 가능"
              )
            ) : accessError ? (
              "확인 실패"
            ) : (
              "잠김"
            )}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">공통 열람가</dt>
          <dd className="font-bold tabular-nums text-slate-900">
            {REPORT_ACCESS_PRICE_POINT.toLocaleString("ko-KR")} P
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">보유 포인트</dt>
          <dd className="font-bold tabular-nums text-slate-900">
            {!isInitialized ? (
              <InlineLoadingState label="로그인 상태를 확인하는 중입니다." />
            ) : !user ? (
              "로그인 후 확인"
            ) : hasAccess ? (
              "열람 권한 보유"
            ) : isBalanceChecking ? (
              <InlineLoadingState label="보유 포인트를 확인하는 중입니다." />
            ) : balance === null ? (
              "조회 실패"
            ) : (
              `${balance.toLocaleString("ko-KR")} P`
            )}
          </dd>
        </div>
      </dl>

      {!isInitialized || isAccessChecking || isBalanceChecking ? (
        <button
          type="button"
          disabled
          className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 bg-slate-300 px-5 text-sm font-bold text-slate-600 disabled:cursor-wait"
        >
          <LoadingSpinner size={18} />
          열람 상태 확인 중
        </button>
      ) : hasAccess ? (
        <a
          href="#project-detailed-info"
          className="mt-6 inline-flex min-h-11 w-full items-center justify-center bg-brand px-5 text-sm font-bold text-white hover:bg-brand-hover"
        >
          프로젝트 상세 정보 보기
        </a>
      ) : accessError || balanceError ? (
        <button
          type="button"
          onClick={retryAccessState}
          disabled={isRetrying}
          className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 border border-slate-400 bg-white px-5 text-sm font-bold text-slate-900 hover:bg-slate-100 disabled:cursor-wait disabled:text-slate-500"
        >
          {isRetrying ? <LoadingSpinner size={18} /> : null}
          {isRetrying ? "다시 확인 중" : "열람 상태 다시 확인"}
        </button>
      ) : !user ? (
        <Link
          href={`/login?next=${encodeURIComponent(`/projects/${projectId}`)}`}
          className="mt-6 inline-flex min-h-11 w-full items-center justify-center bg-brand px-5 text-sm font-bold text-white hover:bg-brand-hover"
        >
          로그인하고 열람하기
        </Link>
      ) : insufficient ? (
        <Link
          href="/mypage/points"
          className="mt-6 inline-flex min-h-11 w-full items-center justify-center bg-brand px-5 text-sm font-bold text-white hover:bg-brand-hover"
        >
          포인트 충전하기
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => setDialog({ key: crypto.randomUUID() })}
          disabled={balance === null || purchaseMutation.isPending}
          className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 bg-brand px-5 text-sm font-bold text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
        >
          {purchaseMutation.isPending ? <LoadingSpinner size={18} /> : null}
          {purchaseMutation.isPending
            ? "상세 정보 열람 중"
            : `${REPORT_ACCESS_PRICE_POINT.toLocaleString("ko-KR")}P로 프로젝트 상세 정보 보기`}
        </button>
      )}
      {accessError || balanceError || purchaseMutation.isError ? (
        <p role="alert" className="mt-3 text-sm leading-6 text-red-700">
          {purchaseMutation.error?.message ??
            accessError?.message ??
            balanceError?.message}
        </p>
      ) : null}
      {purchaseMutation.data ? (
        <p role="status" className="mt-3 text-sm text-emerald-700">
          프로젝트 상세 정보 열람 완료 · 잔액{" "}
          {purchaseMutation.data.balance.toLocaleString("ko-KR")} P
        </p>
      ) : null}

      {dialog && balance !== null ? (
        <PurchaseConfirmationDialog
          open
          title="프로젝트 상세 정보 열람 확인"
          target={projectName}
          price={REPORT_ACCESS_PRICE_POINT}
          balance={balance}
          scope="문제 상황, 해결 방법, 검증 결과, 제약·한계와 연결 자료 열람. 프로젝트 자산의 사용권·소유권·양도 권리는 포함하지 않음."
          confirmLabel="상세 정보 열람"
          isPending={purchaseMutation.isPending}
          onCancel={() => setDialog(null)}
          onConfirm={() => purchaseMutation.mutate(dialog.key)}
        />
      ) : null}
    </aside>
  );
}

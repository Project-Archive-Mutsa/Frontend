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
import { ApiError } from "@/shared/api/api-error";
import { REPORT_ACCESS_PRICE_POINT } from "@/shared/project-report/report-policy";
import { queryKeys } from "@/shared/query/query-keys";
import type { ProjectDetailAccessSummary } from "../model/types";

interface Props {
  projectId: number;
  projectName: string;
  offer: { available: boolean };
  detailAccess: ProjectDetailAccessSummary | null;
}

type ReportAccess = Awaited<ReturnType<typeof getProjectReportAccess>>;

type PurchaseResult = {
  source: "response" | "lookup";
  balance: number | null;
};

function hasReportAccess(access: ReportAccess | undefined) {
  return (
    access?.status === "GRANTED" ||
    access?.status === "OWNER" ||
    access?.unlockMode === "ALREADY_GRANTED"
  );
}

function needsReportAccessLookup(error: unknown) {
  return (
    error instanceof TypeError ||
    (error instanceof ApiError &&
      (error.status === 408 || error.status === 409 || error.status >= 500))
  );
}

function getReportPurchaseError(error: unknown) {
  const message =
    "상세 정보 열람 처리를 완료하지 못했습니다. 포인트 내역과 열람 상태를 확인한 뒤 다시 시도해 주세요.";

  if (error instanceof ApiError) {
    if (error.status === 408 || error.status >= 500) {
      return new ApiError(
        message,
        error.status,
        error.code,
        error.requestId,
        error.fieldErrors,
      );
    }
    return error;
  }

  if (error instanceof TypeError) return new Error(message);
  return error instanceof Error ? error : new Error(message);
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
  detailAccess,
}: Props) {
  const { user, isInitialized } = useAuthSession();
  const queryClient = useQueryClient();
  const [dialog, setDialog] = useState<{ key: string } | null>(null);
  const [retryKey, setRetryKey] = useState<string | null>(null);
  const accessQuery = useQuery({
    queryKey: queryKeys.projects.reportAccess(projectId),
    queryFn: ({ signal }) => getProjectReportAccess(projectId, signal),
    enabled: Boolean(user),
    retry: false,
  });
  const access = accessQuery.data;
  const hasAccess = hasReportAccess(access);
  const accessPrice =
    detailAccess?.pricePoint ?? REPORT_ACCESS_PRICE_POINT;
  const pointAccessAvailable =
    detailAccess?.unlockMode === "POINT_ACCESS"
      ? detailAccess.available
      : offer.available;
  const reportUnavailable =
    !pointAccessAvailable || access?.status === "UNAVAILABLE";
  const purchaseEnabled =
    access?.purchaseEnabled ??
    detailAccess?.purchaseEnabled ??
    pointAccessAvailable;
  const shouldLoadBalance = Boolean(
    user &&
      pointAccessAvailable &&
      purchaseEnabled &&
      !hasAccess &&
      access?.status !== "UNAVAILABLE",
  );
  const balanceQuery = useQuery({
    queryKey: queryKeys.points.balance,
    queryFn: ({ signal }) => getMyPointBalance(signal),
    enabled: shouldLoadBalance,
    retry: false,
  });
  const purchaseMutation = useMutation({
    mutationFn: async (key: string): Promise<PurchaseResult> => {
      try {
        const result = await purchaseProjectReport(projectId, key);
        return { source: "response", balance: result.balance };
      } catch (error) {
        if (needsReportAccessLookup(error)) {
          try {
            const confirmedAccess = await queryClient.fetchQuery({
              queryKey: queryKeys.projects.reportAccess(projectId),
              queryFn: ({ signal }) =>
                getProjectReportAccess(projectId, signal),
              staleTime: 0,
            });

            if (hasReportAccess(confirmedAccess)) {
              const confirmedBalance = await queryClient
                .fetchQuery({
                  queryKey: queryKeys.points.balance,
                  queryFn: ({ signal }) => getMyPointBalance(signal),
                  staleTime: 0,
                })
                .catch(() => null);

              return {
                source: "lookup",
                balance: confirmedBalance?.availablePoint ?? null,
              };
            }
          } catch {
            // 원래 결제 요청의 오류를 기준으로 안내한다.
          }
        }

        throw getReportPurchaseError(error);
      }
    },
    retry: false,
    onSuccess: async () => {
      setDialog(null);
      setRetryKey(null);
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
    onError: (_error, key) => {
      setRetryKey(key);
      setDialog(null);
    },
  });
  const balance = balanceQuery.data?.availablePoint ?? null;
  const insufficient =
    balance !== null && balance < accessPrice;
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
            {accessPrice.toLocaleString("ko-KR")} P
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
      ) : !purchaseEnabled ? (
        <button
          type="button"
          disabled
          className="mt-6 inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center bg-slate-300 px-5 text-sm font-bold text-slate-600"
        >
          현재 상세 정보를 열람할 수 없음
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            purchaseMutation.reset();
            setDialog({ key: retryKey ?? crypto.randomUUID() });
          }}
          disabled={balance === null || purchaseMutation.isPending}
          className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 bg-brand px-5 text-sm font-bold text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
        >
          {purchaseMutation.isPending ? <LoadingSpinner size={18} /> : null}
          {purchaseMutation.isPending
            ? "상세 정보 열람 중"
            : `${accessPrice.toLocaleString("ko-KR")}P로 프로젝트 상세 정보 보기`}
        </button>
      )}
      {accessError || balanceError || purchaseMutation.isError ? (
        <div role="alert" className="mt-3 text-sm leading-6 text-red-700">
          <p>
            {purchaseMutation.error?.message ??
              accessError?.message ??
              balanceError?.message}
          </p>
          {purchaseMutation.error instanceof ApiError &&
          purchaseMutation.error.requestId ? (
            <p className="mt-1 text-xs">
              요청 ID: {purchaseMutation.error.requestId}
            </p>
          ) : null}
          {purchaseMutation.isError ? (
            <Link
              href="/mypage/points"
              className="mt-2 inline-flex min-h-11 items-center font-bold underline underline-offset-4"
            >
              포인트 내역 확인
            </Link>
          ) : null}
        </div>
      ) : null}
      {purchaseMutation.data ? (
        <p role="status" className="mt-3 text-sm text-emerald-700">
          {purchaseMutation.data.source === "lookup"
            ? "열람 권한 반영을 확인했습니다."
            : "프로젝트 상세 정보 열람 완료"}
          {purchaseMutation.data.balance !== null
            ? ` · 잔액 ${purchaseMutation.data.balance.toLocaleString("ko-KR")} P`
            : null}
        </p>
      ) : null}

      {dialog && balance !== null ? (
        <PurchaseConfirmationDialog
          open
          title="프로젝트 상세 정보 열람 확인"
          target={projectName}
          price={accessPrice}
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

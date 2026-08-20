"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getMyPointBalance } from "@/features/project-detail/api/get-my-point-balance";
import { getProjectViewer } from "@/features/project-detail/api/get-project-viewer";
import { purchaseProject } from "@/features/project-market/api/purchase-project";
import useAuthSession from "@/shared/auth/hooks/use-auth-session";
import LoadingSpinner from "@/shared/components/loading-spinner/loading-spinner";
import PurchaseConfirmationDialog from "@/shared/components/purchase-confirmation-dialog/purchase-confirmation-dialog";
import { queryKeys } from "@/shared/query/query-keys";

interface Props {
  projectId: number;
  projectName: string;
  price: number;
  transferScope?: string;
  disabled?: boolean;
  returnPath?: string;
  unavailableMessage?: string;
}

export default function ProjectPurchaseButton({
  projectId,
  projectName,
  price,
  transferScope = "프로젝트 전체 자산과 권리",
  disabled = false,
  returnPath = "/project-market",
  unavailableMessage = "현재 구매할 수 없는 판매 상태입니다.",
}: Props) {
  const { user, isInitialized } = useAuthSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const balanceQuery = useQuery({
    queryKey: queryKeys.points.balance,
    queryFn: ({ signal }) => getMyPointBalance(signal),
    enabled: Boolean(user && !disabled),
    retry: false,
  });
  const viewerQuery = useQuery({
    queryKey: queryKeys.projects.viewer(projectId),
    queryFn: ({ signal }) => getProjectViewer(projectId, signal),
    enabled: Boolean(user),
    retry: false,
  });
  const mutation = useMutation({
    mutationFn: () => purchaseProject(projectId),
    retry: false,
    onSuccess: async () => {
      setOpen(false);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.points.balance }),
        queryClient.invalidateQueries({ queryKey: queryKeys.points.transactions }),
        queryClient.invalidateQueries({ queryKey: queryKeys.projects.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.projects.reportAccess(projectId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.projects.report(projectId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.projects.detailedInfoFiles(projectId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.mypage.all }),
      ]);
      router.refresh();
    },
  });
  const balance = balanceQuery.data?.availablePoint ?? null;
  const insufficient = balance !== null && balance < price;
  const owner = viewerQuery.data?.owner === true;
  const purchaseResult = mutation.data;
  const checkingPurchaseState =
    Boolean(user) && (balanceQuery.isPending || viewerQuery.isPending);
  const hasRequestError =
    balanceQuery.isError || viewerQuery.isError || mutation.isError;

  const handleStart = () => {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(returnPath)}`);
      return;
    }
    if (!owner && !insufficient && balance !== null) setOpen(true);
  };

  return (
    <div>
      {purchaseResult ? (
        <div role="status">
          <p className="text-sm font-bold text-slate-900">
            구매가 완료되어 내 프로젝트로 이전되었습니다.
          </p>
          <p className="mt-2 text-sm text-emerald-700">
            {purchaseResult.paidPoint.toLocaleString("ko-KR")}P 결제 · 잔액{" "}
            {purchaseResult.buyerBalance.toLocaleString("ko-KR")}P
          </p>
        </div>
      ) : owner ? (
        <p className="text-sm font-bold text-slate-500">
          현재 소유한 프로젝트입니다.
        </p>
      ) : disabled ? (
        <>
          <button
            type="button"
            disabled
            className="flex min-h-11 w-full cursor-not-allowed items-center justify-center bg-slate-300 px-4 text-sm font-bold text-slate-600"
          >
            프로젝트 권리 구매
          </button>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
            {unavailableMessage}
          </p>
        </>
      ) : insufficient ? (
        <Link
          href="/mypage/points"
          className="inline-flex min-h-11 w-full items-center justify-center bg-brand px-5 text-sm font-bold text-white hover:bg-brand-hover"
        >
          포인트 충전하기
        </Link>
      ) : (
        <button
          type="button"
          onClick={handleStart}
          disabled={
            !isInitialized ||
            checkingPurchaseState ||
            mutation.isPending ||
            (Boolean(user) &&
              (balance === null ||
                viewerQuery.isError ||
                balanceQuery.isError))
          }
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 bg-brand px-4 text-sm font-bold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          {checkingPurchaseState || mutation.isPending ? (
            <LoadingSpinner size={18} />
          ) : null}
          {checkingPurchaseState
            ? "구매 조건 확인 중"
            : mutation.isPending
              ? "구매 중"
              : "프로젝트 권리 구매"}
        </button>
      )}
      {!purchaseResult && balance !== null ? (
        <p className="mt-2 text-xs text-slate-500">
          보유 포인트 {balance.toLocaleString("ko-KR")} P
        </p>
      ) : null}
      {!purchaseResult && hasRequestError ? (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {mutation.error?.message ??
            viewerQuery.error?.message ??
            balanceQuery.error?.message}
        </p>
      ) : null}
      {!purchaseResult && open && balance !== null ? (
        <PurchaseConfirmationDialog
          open
          title="프로젝트 구매 확인"
          target={projectName}
          price={price}
          balance={balance}
          scope={transferScope}
          confirmLabel="프로젝트 구매"
          isPending={mutation.isPending}
          onCancel={() => setOpen(false)}
          onConfirm={() => mutation.mutate()}
        />
      ) : null}
    </div>
  );
}

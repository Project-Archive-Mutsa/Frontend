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
}

export default function ProjectPurchaseButton({ projectId, projectName, price, transferScope = "프로젝트 전체 자산과 권리", disabled = false, returnPath = "/project-market" }: Props) {
  const { user, isInitialized } = useAuthSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const balanceQuery = useQuery({ queryKey: queryKeys.points.balance, queryFn: ({ signal }) => getMyPointBalance(signal), enabled: Boolean(user), retry: false });
  const viewerQuery = useQuery({ queryKey: queryKeys.projects.viewer(projectId), queryFn: ({ signal }) => getProjectViewer(projectId, signal), enabled: Boolean(user && !disabled), retry: false });
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
  const checkingPurchaseState = Boolean(user) && (balanceQuery.isPending || viewerQuery.isPending);

  const handleStart = () => {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(returnPath)}`);
      return;
    }
    if (!owner && !insufficient && balance !== null) setOpen(true);
  };

  return (
    <div className="mt-5">
      {owner ? (
        <p className="text-sm font-bold text-slate-500">본인 프로젝트는 구매할 수 없습니다.</p>
      ) : insufficient ? (
        <Link href="/mypage/points" className="inline-flex min-h-11 items-center justify-center bg-brand px-5 text-sm font-bold text-white hover:bg-brand-hover">포인트 충전하기</Link>
      ) : (
        <button type="button" onClick={handleStart} disabled={disabled || !isInitialized || checkingPurchaseState || mutation.isPending || mutation.isSuccess} className="inline-flex min-h-11 items-center justify-center gap-2 bg-brand px-5 text-sm font-bold text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60">
          {checkingPurchaseState || mutation.isPending ? <LoadingSpinner size={18} /> : null}
          {mutation.isSuccess ? "구매 완료" : checkingPurchaseState ? "구매 조건 확인 중" : mutation.isPending ? "구매 중" : "프로젝트 권리 구매"}
        </button>
      )}
      {balance !== null ? <p className="mt-2 text-xs text-slate-500">보유 포인트 {balance.toLocaleString("ko-KR")} P</p> : null}
      {balanceQuery.isError || viewerQuery.isError || mutation.isError ? <p role="alert" className="mt-2 text-sm text-red-700">{mutation.error?.message ?? viewerQuery.error?.message ?? balanceQuery.error?.message}</p> : null}
      {mutation.data ? <p role="status" className="mt-2 text-sm text-emerald-700">{mutation.data.paidPoint.toLocaleString("ko-KR")}P 결제 완료 · 잔액 {mutation.data.buyerBalance.toLocaleString("ko-KR")}P</p> : null}
      {open && balance !== null ? <PurchaseConfirmationDialog open title="프로젝트 구매 확인" target={projectName} price={price} balance={balance} scope={transferScope} confirmLabel="프로젝트 구매" isPending={mutation.isPending} onCancel={() => setOpen(false)} onConfirm={() => mutation.mutate()} /> : null}
    </div>
  );
}

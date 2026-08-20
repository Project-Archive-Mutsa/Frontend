"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  chargePoints,
  getPointBalance,
  getPointTransactions,
} from "../api/mypage-api";
import PointBalanceSummary from "./point-balance-summary";
import PointChargeForm from "./point-charge-form";
import PointTransactionList from "./point-transaction-list";
import useAuthSession from "@/shared/auth/hooks/use-auth-session";
import { queryKeys } from "@/shared/query/query-keys";
import {
  MypageHeader,
  MypageLoading,
  MypageLoginRequired,
} from "./mypage-state";

export default function PointsSection() {
  const { user, isInitialized } = useAuthSession();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");

  const balanceQuery = useQuery({
    queryKey: queryKeys.points.balance,
    queryFn: getPointBalance,
    enabled: Boolean(user),
  });
  const transactionsQuery = useQuery({
    queryKey: queryKeys.points.transactions,
    queryFn: getPointTransactions,
    enabled: Boolean(user),
    retry: false,
  });
  const chargeMutation = useMutation({
    mutationFn: () => chargePoints(Number(amount)),
    retry: false,
    onSuccess: (chargedBalance) => {
      setAmount("");
      queryClient.setQueryData(queryKeys.points.balance, {
        totalPoint: chargedBalance.totalPoint,
        availablePoint: chargedBalance.availablePoint,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.points.transactions,
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.mypage.all });
    },
  });

  if (!isInitialized) return <MypageLoading />;
  if (!user) return <MypageLoginRequired nextPath="/mypage/points" />;

  const handleAmountChange = (nextAmount: string) => {
    chargeMutation.reset();
    setAmount(nextAmount);
  };

  return (
    <section className="mx-auto w-full max-w-6xl py-12">
      <MypageHeader
        title="포인트"
        description="테스트 포인트를 충전하고 프로젝트 구매·상세 정보 열람 내역을 확인합니다."
      />

      <div className="mt-8 overflow-hidden rounded-xl border border-slate-300 bg-white lg:grid lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
        <PointChargeForm
          amount={amount}
          errorMessage={
            chargeMutation.isError ? chargeMutation.error.message : null
          }
          isPending={chargeMutation.isPending}
          onAmountChange={handleAmountChange}
          onSubmit={() => chargeMutation.mutate()}
          successMessage={
            chargeMutation.isSuccess
              ? `${chargeMutation.data.chargedPoint.toLocaleString("ko-KR")} P가 충전되었습니다.`
              : null
          }
        />
        <PointBalanceSummary
          balance={balanceQuery.data}
          errorMessage={balanceQuery.isError ? balanceQuery.error.message : null}
          isPending={balanceQuery.isPending}
          onRetry={() => void balanceQuery.refetch()}
        />
      </div>

      <section aria-labelledby="point-transactions-title" className="mt-12">
        <h2
          id="point-transactions-title"
          className="font-display text-2xl font-bold tracking-[-0.025em] text-slate-950"
        >
          거래내역
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          충전과 구매, 판매 정산 내역을 최신순으로 확인할 수 있습니다.
        </p>
        <PointTransactionList
          errorMessage={
            transactionsQuery.isError ? transactionsQuery.error.message : null
          }
          isPending={transactionsQuery.isPending}
          onRetry={() => void transactionsQuery.refetch()}
          transactions={transactionsQuery.data}
        />
      </section>
    </section>
  );
}

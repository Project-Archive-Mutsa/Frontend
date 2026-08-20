"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { applyToRecruitment } from "@/features/team-recruitment/api/apply-to-recruitment";
import { getMyRecruitmentApplication } from "@/features/team-recruitment/api/get-my-recruitment-application";
import { ApiError } from "@/shared/api/api-error";
import useAuthSession from "@/shared/auth/hooks/use-auth-session";
import LoadingSpinner from "@/shared/components/loading-spinner/loading-spinner";
import { queryKeys } from "@/shared/query/query-keys";

interface RecruitmentApplicationFormProps {
  recruitmentId: number;
  roles: readonly string[];
  closed: boolean;
  returnPath?: string;
}

type ApplicationResult = {
  applicationId: number;
  status: string;
  source: "response" | "lookup";
};

const applicationStatusLabels: Record<string, string> = {
  PENDING: "검토 중",
  ACCEPTED: "수락",
  REJECTED: "거절",
  WITHDRAWN: "지원 취소",
};

function needsApplicationLookup(error: unknown) {
  return (
    error instanceof TypeError ||
    (error instanceof ApiError && (error.status === 409 || error.status >= 500))
  );
}

export default function RecruitmentApplicationForm({
  recruitmentId,
  roles,
  closed,
  returnPath = "/team-recruitment",
}: RecruitmentApplicationFormProps) {
  const { user, isInitialized } = useAuthSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [role, setRole] = useState(roles[0] ?? "");
  const [message, setMessage] = useState("");

  const applicationQuery = useQuery({
    queryKey: queryKeys.recruitments.myApplication(recruitmentId),
    queryFn: () => getMyRecruitmentApplication(recruitmentId),
    enabled: Boolean(user && !closed),
  });
  const existingApplication = applicationQuery.data;

  const mutation = useMutation({
    mutationFn: async (): Promise<ApplicationResult> => {
      try {
        const result = await applyToRecruitment(recruitmentId, role, message);
        return { ...result, source: "response" };
      } catch (error) {
        if (!needsApplicationLookup(error)) throw error;

        try {
          const confirmed = await queryClient.fetchQuery({
            queryKey: queryKeys.recruitments.myApplication(recruitmentId),
            queryFn: () => getMyRecruitmentApplication(recruitmentId),
            staleTime: 0,
          });

          if (confirmed) {
            return {
              applicationId: confirmed.applicationId,
              status: confirmed.status,
              source: "lookup",
            };
          }
        } catch {
          // 원래 지원 요청의 오류를 기준으로 안내한다.
        }

        if (error instanceof ApiError && error.status === 409) throw error;

        const message =
          "서버 응답이 불안정해 지원 처리 결과를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.";
        if (error instanceof ApiError) {
          throw new ApiError(
            message,
            error.status,
            error.code,
            error.requestId,
            error.fieldErrors,
          );
        }
        throw new Error(message);
      }
    },
    retry: false,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.recruitments.myApplications,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.recruitments.myApplication(recruitmentId),
      });
    },
  });

  if (closed) {
    return (
      <p className="mt-5 text-sm font-bold text-slate-500">
        모집이 마감되었습니다.
      </p>
    );
  }

  const application = existingApplication ?? mutation.data;
  const isApplied = Boolean(application);
  const isApplicationChecking = Boolean(
    !isInitialized || (user && applicationQuery.isPending),
  );
  const isBusy = isApplicationChecking || mutation.isPending;
  const statusLabel = application
    ? (applicationStatusLabels[application.status] ?? application.status)
    : null;

  return (
    <form
      aria-busy={isBusy || undefined}
      className="mt-5 grid gap-3 sm:grid-cols-[12rem_minmax(0,1fr)_auto] sm:items-end"
      onSubmit={(event) => {
        event.preventDefault();
        if (!user) {
          router.push(`/login?next=${encodeURIComponent(returnPath)}`);
          return;
        }
        if (mutation.isPending || isApplied) return;
        mutation.mutate();
      }}
    >
      <label>
        <span className="text-xs font-bold text-slate-700">지원 역할</span>
        <select
          required
          value={role}
          disabled={mutation.isPending || isApplied}
          onChange={(event) => setRole(event.target.value)}
          className="mt-1 h-11 w-full border border-slate-300 bg-white px-3 text-sm disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
        >
          <option value="" disabled>
            역할 선택
          </option>
          {roles.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label>
        <span className="text-xs font-bold text-slate-700">지원 메시지</span>
        <input
          required
          maxLength={1000}
          value={message}
          disabled={mutation.isPending || isApplied}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="경험과 참여 가능 일정을 적어 주세요"
          className="mt-1 h-11 w-full border border-slate-300 bg-white px-3 text-sm disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
        />
      </label>
      <button
        type="submit"
        disabled={isBusy || isApplied || !role}
        className="inline-flex h-11 items-center justify-center gap-2 bg-brand px-5 text-sm font-bold text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isBusy ? <LoadingSpinner size={18} /> : null}
        {isApplied
          ? "지원 완료"
          : mutation.isPending
            ? "지원 결과 확인 중"
            : isApplicationChecking
              ? "지원 여부 확인 중"
              : "지원하기"}
      </button>
      {mutation.isError && !application ? (
        <p role="alert" className="text-sm text-red-700 sm:col-span-3">
          {mutation.error.message}
          {mutation.error instanceof ApiError && mutation.error.requestId ? (
            <span className="mt-1 block text-xs">
              요청 ID: {mutation.error.requestId}
            </span>
          ) : null}
        </p>
      ) : null}
      {application ? (
        <p
          role="status"
          className={`text-sm sm:col-span-3 ${mutation.data ? "text-emerald-700" : "text-slate-700"}`}
        >
          {mutation.data?.source === "response"
            ? "지원이 접수되었습니다."
            : mutation.data?.source === "lookup"
              ? `지원 내역에서 접수를 확인했습니다. 현재 상태: ${statusLabel}`
              : `이미 지원한 모집글입니다. 현재 상태: ${statusLabel}`}
        </p>
      ) : null}
    </form>
  );
}

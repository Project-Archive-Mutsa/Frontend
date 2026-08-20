"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { applyToRecruitment } from "@/features/team-recruitment/api/apply-to-recruitment";
import useAuthSession from "@/shared/auth/hooks/use-auth-session";
import LoadingSpinner from "@/shared/components/loading-spinner/loading-spinner";
import { queryKeys } from "@/shared/query/query-keys";

export default function RecruitmentApplicationForm({ recruitmentId, roles, closed, returnPath = "/team-recruitment" }: { recruitmentId: number; roles: readonly string[]; closed: boolean; returnPath?: string }) {
  const { user, isInitialized } = useAuthSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [role, setRole] = useState(roles[0] ?? "");
  const [message, setMessage] = useState("");
  const mutation = useMutation({ mutationFn: () => applyToRecruitment(recruitmentId, role, message), retry: false, onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: queryKeys.mypage.applications }); } });
  if (closed) return <p className="mt-5 text-sm font-bold text-slate-500">모집이 마감되었습니다.</p>;
  return (
    <form className="mt-5 grid gap-3 sm:grid-cols-[12rem_minmax(0,1fr)_auto] sm:items-end" onSubmit={(event) => { event.preventDefault(); if (!user) { router.push(`/login?next=${encodeURIComponent(returnPath)}`); return; } mutation.mutate(); }}>
      <label><span className="text-xs font-bold text-slate-700">지원 역할</span><select required value={role} onChange={(event) => setRole(event.target.value)} className="mt-1 h-11 w-full border border-slate-300 bg-white px-3 text-sm"><option value="" disabled>역할 선택</option>{roles.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span className="text-xs font-bold text-slate-700">지원 메시지</span><input required maxLength={1000} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="경험과 참여 가능 일정을 적어 주세요" className="mt-1 h-11 w-full border border-slate-300 bg-white px-3 text-sm" /></label>
      <button type="submit" disabled={!isInitialized || mutation.isPending || mutation.isSuccess || !role} className="inline-flex h-11 items-center justify-center gap-2 bg-brand px-5 text-sm font-bold text-white hover:bg-brand-hover disabled:opacity-60">{mutation.isPending ? <LoadingSpinner size={18} /> : null}{mutation.isSuccess ? "지원 완료" : mutation.isPending ? "지원 중" : "지원하기"}</button>
      {mutation.isError ? <p role="alert" className="text-sm text-red-700 sm:col-span-3">{mutation.error.message}</p> : null}
      {mutation.isSuccess ? <p role="status" className="text-sm text-emerald-700 sm:col-span-3">지원이 접수되었습니다.</p> : null}
    </form>
  );
}

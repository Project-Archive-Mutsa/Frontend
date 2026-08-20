"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getMyRecruitmentApplications } from "@/features/team-recruitment/api/get-my-recruitment-applications";
import useAuthSession from "@/shared/auth/hooks/use-auth-session";
import { queryKeys } from "@/shared/query/query-keys";
import { MypageError, MypageHeader, MypageLoading, MypageLoginRequired } from "./mypage-state";

const statusLabels: Record<string, string> = { PENDING: "검토 중", ACCEPTED: "수락", REJECTED: "거절", WITHDRAWN: "지원 취소" };

export default function TeamApplicationsSection() {
  const { user, isInitialized } = useAuthSession();
  const query = useQuery({ queryKey: queryKeys.recruitments.myApplications, queryFn: getMyRecruitmentApplications, enabled: Boolean(user) });
  if (!isInitialized || (user && query.isPending)) return <MypageLoading />;
  if (!user) return <MypageLoginRequired />;
  if (query.isError) return <MypageError message={query.error.message} />;
  return <section className="mx-auto w-full max-w-6xl py-12"><MypageHeader title="팀 지원내역" description="지원한 역할과 현재 검토 상태를 확인합니다." />{query.data?.length ? <ul className="mt-8 divide-y divide-slate-200 border-y border-slate-300">{query.data.map((item) => <li key={item.applicationId} className="grid gap-4 py-6 sm:grid-cols-[minmax(0,1fr)_12rem_10rem] sm:items-center"><div><h2 className="text-lg font-bold text-slate-950"><Link href={`/projects/${item.projectId}`} className="hover:underline">{item.projectName ?? `프로젝트 #${item.projectId}`}</Link></h2><p className="mt-1 text-sm text-slate-500">{item.recruitmentTitle ?? `모집글 #${item.recruitmentId}`}</p></div><div><p className="text-xs text-slate-500">지원 역할</p><p className="mt-1 text-sm font-bold">{item.role}</p></div><div><p className="text-xs text-slate-500">상태</p><p className="mt-1 text-sm font-bold">{statusLabels[item.status] ?? item.status}</p></div></li>)}</ul> : <p className="mt-8 border-y border-slate-300 py-10 text-center text-sm text-slate-500">팀 지원내역이 없습니다.</p>}</section>;
}

"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getMyProjects } from "../api/mypage-api";
import useAuthSession from "@/shared/auth/hooks/use-auth-session";
import { queryKeys } from "@/shared/query/query-keys";
import { MypageError, MypageHeader, MypageLoading, MypageLoginRequired } from "./mypage-state";

export default function MyProjectsSection() {
  const { user, isInitialized } = useAuthSession();
  const query = useQuery({ queryKey: user ? queryKeys.mypage.projects(user.userId) : queryKeys.mypage.all, queryFn: () => getMyProjects(user!.userId), enabled: Boolean(user) });
  if (!isInitialized || (user && query.isPending)) return <MypageLoading />;
  if (!user) return <MypageLoginRequired />;
  if (query.isError) return <MypageError message={query.error.message} />;
  return <section className="mx-auto w-full max-w-6xl py-12"><MypageHeader title="내 프로젝트" description={`등록한 프로젝트 ${query.data?.totalCount ?? 0}개를 확인합니다.`} />{query.data?.projects.length ? <ul className="mt-8 divide-y divide-slate-200 border-y border-slate-300">{query.data.projects.map((project) => <li key={project.projectId} className="grid gap-5 py-6 sm:grid-cols-[minmax(0,1fr)_12rem_10rem] sm:items-center"><div><p className="text-xs font-bold text-brand">{project.registrationPurposeLabel}</p><h2 className="mt-1 text-lg font-bold text-slate-950"><Link href={`/projects/${project.projectId}`} className="hover:underline">{project.projectName}</Link></h2><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{project.description ?? "공개 소개 미입력"}</p></div><dl className="text-sm"><dt className="text-xs text-slate-500">상태</dt><dd className="mt-1 font-bold text-slate-800">{project.status}</dd><dt className="mt-3 text-xs text-slate-500">저장</dt><dd className="mt-1 tabular-nums">{project.bookmarkCount}</dd></dl><div className="sm:text-right"><p className="font-bold tabular-nums text-brand">{project.price === null ? "판매가 없음" : `${project.price.toLocaleString("ko-KR")} P`}</p><Link href={`/projects/${project.projectId}`} className="mt-3 inline-block text-sm font-bold text-brand underline decoration-brand-accent underline-offset-4">상세 보기</Link></div></li>)}</ul> : <p className="mt-8 border-y border-slate-300 py-10 text-center text-sm text-slate-500">등록한 프로젝트가 없습니다.</p>}</section>;
}

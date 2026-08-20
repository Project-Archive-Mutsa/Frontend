"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getWishlistProjects } from "../api/mypage-api";
import useAuthSession from "@/shared/auth/hooks/use-auth-session";
import ProjectBookmarkButton from "@/shared/components/project-bookmark-button/project-bookmark-button";
import { queryKeys } from "@/shared/query/query-keys";
import { MypageError, MypageHeader, MypageLoading, MypageLoginRequired } from "./mypage-state";

export default function WishlistSection() {
  const { user, isInitialized } = useAuthSession();
  const query = useQuery({ queryKey: queryKeys.mypage.wishlist, queryFn: getWishlistProjects, enabled: Boolean(user) });
  if (!isInitialized || (user && query.isPending)) return <MypageLoading />;
  if (!user) return <MypageLoginRequired />;
  if (query.isError) return <MypageError message={query.error.message} />;
  return <section className="mx-auto w-full max-w-6xl py-12"><MypageHeader title="관심 프로젝트" description={`저장한 프로젝트 ${query.data?.totalCount ?? 0}개입니다.`} />{query.data?.projects.length ? <ul className="mt-8 divide-y divide-slate-200 border-y border-slate-300">{query.data.projects.map((project) => <li key={project.projectId} className="grid gap-5 py-6 sm:grid-cols-[minmax(0,1fr)_12rem_auto] sm:items-center"><div><h2 className="text-lg font-bold text-slate-950"><Link href={`/projects/${project.projectId}`} className="hover:underline">{project.projectName}</Link></h2><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{project.description ?? "공개 소개 미입력"}</p>{project.tags.length ? <p className="mt-2 text-xs text-slate-500">{project.tags.join(" · ")}</p> : null}</div><div className="text-sm"><p className="text-xs text-slate-500">저장일</p><p className="mt-1 font-bold">{project.savedDate}</p></div><ProjectBookmarkButton projectId={project.projectId} projectName={project.projectName} initialBookmarked returnPath="/mypage/wishlist" /></li>)}</ul> : <p className="mt-8 border-y border-slate-300 py-10 text-center text-sm text-slate-500">저장한 프로젝트가 없습니다.</p>}</section>;
}

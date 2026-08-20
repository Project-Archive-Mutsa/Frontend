"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getMyProfile } from "../api/mypage-api";
import useAuthSession from "@/shared/auth/hooks/use-auth-session";
import { queryKeys } from "@/shared/query/query-keys";
import {
  MypageError,
  MypageLoading,
  MypageLoginRequired,
} from "./mypage-state";

const links = [
  ["내 프로젝트", "/mypage/my-projects", "등록한 프로젝트와 판매 상태 확인"],
  ["관심 프로젝트", "/mypage/wishlist", "저장한 프로젝트 다시 보기"],
  ["팀 지원내역", "/mypage/team-applications", "지원한 역할과 진행 상태 확인"],
  ["메시지", "/mypage/messages", "프로젝트 관련 받은 메시지 확인"],
] as const;

export default function MypageDashboard() {
  const { user, isInitialized } = useAuthSession();
  const profileQuery = useQuery({
    queryKey: user
      ? queryKeys.mypage.profile(user.userId)
      : queryKeys.mypage.all,
    queryFn: () => getMyProfile(user!.userId),
    enabled: Boolean(user),
  });

  if (!isInitialized || (user && profileQuery.isPending)) {
    return <MypageLoading />;
  }
  if (!user) return <MypageLoginRequired />;
  if (profileQuery.isError) {
    return <MypageError message={profileQuery.error.message} />;
  }

  const profile = profileQuery.data;
  if (!profile) return null;

  const initial = profile.name.trim().charAt(0) || "나";

  return (
    <section className="mx-auto w-full max-w-5xl py-12">
      <header className="border-b border-slate-300 pb-9">
        <p className="text-xs font-bold text-brand">마이페이지</p>
        <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-5">
            <div
              aria-hidden="true"
              className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand-soft font-display text-2xl font-bold text-brand"
            >
              {initial}
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-3xl font-bold tracking-[-0.025em] text-slate-950 [overflow-wrap:anywhere]">
                {profile.name}
              </h1>
              <p className="mt-1 text-sm text-slate-600">{profile.loginId}</p>
            </div>
          </div>

          <div className="sm:text-right">
            <p className="text-xs font-medium text-slate-500">
              사용 가능 포인트
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-brand">
              {profile.availablePoint.toLocaleString("ko-KR")} P
            </p>
            <Link
              href="/mypage/points"
              className="mt-3 inline-flex min-h-10 items-center text-sm font-bold text-brand underline decoration-brand-accent underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
            >
              충전 및 거래내역 보기
            </Link>
          </div>
        </div>
      </header>

      <section aria-labelledby="mypage-activity-title" className="mt-10">
        <h2
          id="mypage-activity-title"
          className="font-display text-2xl font-bold tracking-[-0.02em] text-slate-950"
        >
          내 활동
        </h2>
        <nav
          aria-label="마이페이지 메뉴"
          className="mt-5 grid border-y border-slate-300 bg-white sm:grid-cols-2"
        >
          {links.map(([label, href, description], index) => (
            <Link
              key={href}
              href={href}
              className={`group min-h-32 px-5 py-6 transition-colors hover:bg-brand-canvas focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-accent motion-reduce:transition-none ${
                index > 0 ? "border-t border-slate-200" : ""
              } ${index === 1 ? "sm:border-t-0 sm:border-l" : ""} ${
                index >= 2 ? "sm:border-t" : ""
              } ${index === 3 ? "sm:border-l" : ""}`}
            >
              <strong className="text-lg text-slate-950 transition-colors group-hover:text-brand motion-reduce:transition-none">
                {label}
              </strong>
              <span className="mt-2 block text-sm leading-6 text-slate-600">
                {description}
              </span>
              <span className="mt-4 block text-xs font-bold text-brand">
                바로가기
              </span>
            </Link>
          ))}
        </nav>
      </section>
    </section>
  );
}

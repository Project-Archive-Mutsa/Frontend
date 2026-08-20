"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getMessages } from "../api/mypage-api";
import useAuthSession from "@/shared/auth/hooks/use-auth-session";
import { queryKeys } from "@/shared/query/query-keys";
import { MypageError, MypageHeader, MypageLoading, MypageLoginRequired } from "./mypage-state";

export default function MessagesSection() {
  const { user, isInitialized } = useAuthSession();
  const query = useQuery({ queryKey: queryKeys.mypage.messages, queryFn: getMessages, enabled: Boolean(user) });
  if (!isInitialized || (user && query.isPending)) return <MypageLoading />;
  if (!user) return <MypageLoginRequired />;
  if (query.isError) return <MypageError message={query.error.message} />;
  return <section className="mx-auto w-full max-w-4xl py-12"><MypageHeader title="메시지" description="프로젝트와 관련해 받은 메시지를 확인합니다." /><div className="mt-6 flex items-center justify-between gap-5"><p className="text-sm text-slate-600">받은 메시지 {query.data?.length ?? 0}개</p><div className="text-right"><button type="button" disabled className="min-h-10 cursor-not-allowed bg-slate-300 px-4 text-sm font-bold text-slate-600">새 메시지</button><p className="mt-1 text-xs font-bold text-red-700">백엔드 미구현</p></div></div>{query.data?.length ? <ul className="mt-6 divide-y divide-slate-200 border-y border-slate-300">{query.data.map((message) => <li key={message.messageId}><Link href={`/mypage/messages/${message.messageId}`} className="grid gap-2 py-5 sm:grid-cols-[12rem_minmax(0,1fr)_10rem] sm:items-center"><div><p className={`text-sm ${message.read ? "font-medium" : "font-bold"}`}>{message.senderNickname}</p><p className="mt-1 text-xs text-slate-500">{message.projectName}</p></div><p className="truncate text-sm text-slate-600">{message.preview}</p><time dateTime={message.createdAt} className="text-xs text-slate-500 sm:text-right">{new Date(message.createdAt).toLocaleString("ko-KR")}</time></Link></li>)}</ul> : <p className="mt-6 border-y border-slate-300 py-10 text-center text-sm text-slate-500">받은 메시지가 없습니다.</p>}</section>;
}

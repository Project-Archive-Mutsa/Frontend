"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getMessage } from "../api/mypage-api";
import useAuthSession from "@/shared/auth/hooks/use-auth-session";
import { queryKeys } from "@/shared/query/query-keys";
import { MypageError, MypageLoading, MypageLoginRequired } from "./mypage-state";

export default function MessageDetailSection({ messageId }: { messageId: number }) {
  const { user, isInitialized } = useAuthSession();
  const query = useQuery({ queryKey: queryKeys.mypage.message(messageId), queryFn: () => getMessage(messageId), enabled: Boolean(user) });
  if (!isInitialized || (user && query.isPending)) return <MypageLoading />;
  if (!user) return <MypageLoginRequired />;
  if (query.isError) return <MypageError message={query.error.message} />;
  const message = query.data;
  if (!message) return null;
  return <article className="mx-auto w-full max-w-4xl py-12"><nav><Link href="/mypage/messages" className="text-sm font-bold text-brand underline decoration-brand-accent underline-offset-4">메시지 목록</Link></nav><header className="mt-6 border-y border-slate-300 py-6"><p className="text-xs text-slate-500">{message.projectName}</p><h1 className="font-display mt-2 text-2xl font-bold text-slate-950">{message.senderNickname}님의 메시지</h1><time dateTime={message.createdAt} className="mt-2 block text-xs text-slate-500">{new Date(message.createdAt).toLocaleString("ko-KR")}</time></header><div className="min-h-48 whitespace-pre-line border-b border-slate-300 py-8 text-sm leading-8 text-slate-700">{message.content}</div><div className="mt-6 flex items-start justify-between gap-6"><Link href={`/projects/${message.projectId}`} className="text-sm font-bold text-brand underline decoration-brand-accent underline-offset-4">프로젝트 보기</Link><div className="text-right"><button type="button" disabled className="min-h-10 cursor-not-allowed bg-slate-300 px-4 text-sm font-bold text-slate-600">답장</button><p className="mt-1 text-xs font-bold text-red-700">백엔드 미구현</p></div></div></article>;
}

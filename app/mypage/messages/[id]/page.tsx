import { notFound } from "next/navigation";
import MessageDetailSection from "@/features/mypage/components/message-detail-section";

export default async function MessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isSafeInteger(id) || id <= 0) notFound();
  return <main className="flex-1 bg-slate-50 px-5 sm:px-8"><MessageDetailSection messageId={id} /></main>;
}

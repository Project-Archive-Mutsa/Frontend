import type { Metadata } from "next";
import ZombieProjectSection from "@/features/zombie-projects/components/zombie-project-section";

export const metadata: Metadata = {
  title: "좀비 프로젝트 | 프로젝트 탐색 | Project Archive",
  description: "공개된 자산과 기존 시도를 바탕으로 다시 계승할 프로젝트를 찾아보세요.",
};

interface ZombieProjectPageProps {
  searchParams: Promise<{
    q?: string | string[];
  }>;
}

export default async function ZombieProjectPage({
  searchParams,
}: ZombieProjectPageProps) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";

  return (
    <main className="flex flex-1 bg-slate-50">
      <ZombieProjectSection query={query} />
    </main>
  );
}

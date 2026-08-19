import type { Metadata } from "next";
import ProjectMarketSection from "@/features/project-market/components/project-market-section";

export const metadata: Metadata = {
  title: "판매 중인 프로젝트 | 프로젝트 탐색 | Project Archive",
  description: "판매할 프로젝트의 자산, 권리 범위와 희망 가격을 확인하세요.",
};

interface ProjectMarketPageProps {
  searchParams: Promise<{
    q?: string | string[];
  }>;
}

export default async function ProjectMarketPage({
  searchParams,
}: ProjectMarketPageProps) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";

  return (
    <main className="flex flex-1 bg-slate-50">
      <ProjectMarketSection query={query} />
    </main>
  );
}

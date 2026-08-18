import type { Metadata } from "next";
import ProjectDiscoverySection from "@/features/project-discovery/components/project-discovery-section";

export const metadata: Metadata = {
  title: "AI 프로젝트 검색 | Project Archive",
  description: "아이디어의 문제 정의와 해결 방식을 분석해 유사한 기존 출품작을 비교하세요.",
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string | string[];
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";

  return (
    <main className="flex flex-1 bg-slate-50">
      <ProjectDiscoverySection query={query} />
    </main>
  );
}

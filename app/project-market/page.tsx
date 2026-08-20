import type { Metadata } from "next";
import ProjectMarketSection from "@/features/project-market/components/project-market-section";

export const metadata: Metadata = {
  title: "판매 중인 프로젝트 | 프로젝트 탐색 | Project Archive",
  description: "판매할 프로젝트의 자산, 권리 범위와 희망 가격을 확인하세요.",
};

interface ProjectMarketPageProps {
  searchParams: Promise<{
    q?: string | string[];
    assetCategory?: string | string[];
    category?: string | string[];
    sort?: string | string[];
    page?: string | string[];
  }>;
}

export default async function ProjectMarketPage({
  searchParams,
}: ProjectMarketPageProps) {
  const params = await searchParams;
  const { q } = params;
  const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";
  const value = (name: "assetCategory" | "category" | "sort" | "page") => {
    const raw = params[name];
    return (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? "";
  };

  return (
    <main className="flex flex-1 bg-slate-50">
      <ProjectMarketSection state={{ query, assetCategory: value("assetCategory"), category: value("category"), sort: value("sort") === "POPULAR" ? "POPULAR" : "RECENT", page: /^\d+$/.test(value("page")) ? Number(value("page")) : 0 }} />
    </main>
  );
}

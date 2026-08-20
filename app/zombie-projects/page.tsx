import type { Metadata } from "next";
import ZombieProjectSection from "@/features/zombie-projects/components/zombie-project-section";

export const metadata: Metadata = {
  title: "좀비 프로젝트 | 프로젝트 탐색 | Project Archive",
  description: "공개된 자산과 기존 시도를 바탕으로 다시 계승할 프로젝트를 찾아보세요.",
};

interface ZombieProjectPageProps {
  searchParams: Promise<{
    q?: string | string[];
    category?: string | string[];
    assetCategory?: string | string[];
    resultLevel?: string | string[];
    activityStatus?: string | string[];
    eventType?: string | string[];
    sort?: string | string[];
    page?: string | string[];
  }>;
}

export default async function ZombieProjectPage({
  searchParams,
}: ZombieProjectPageProps) {
  const params = await searchParams;
  const { q } = params;
  const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";
  const value = (name: keyof typeof params) => {
    const raw = params[name];
    return (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? "";
  };
  const state = { query, category: value("category"), assetCategory: value("assetCategory"), resultLevel: value("resultLevel"), activityStatus: value("activityStatus"), eventType: value("eventType"), sort: value("sort") === "POPULAR" ? "POPULAR" as const : "RECENT" as const, page: /^\d+$/.test(value("page")) ? Number(value("page")) : 0 };

  return (
    <main className="flex flex-1 bg-slate-50">
      <ZombieProjectSection state={state} />
    </main>
  );
}

import Link from "next/link";
import { getProjectMarketPage } from "@/features/project-market/api/get-project-market-projects";
import ProjectMarketCard from "./project-market-card";

interface ProjectMarketListProps {
  state: { query: string; assetCategory: string; category: string; sort: "RECENT" | "POPULAR"; page: number };
}

function pageHref(state: ProjectMarketListProps["state"], page: number) {
  const params = new URLSearchParams();
  Object.entries({ ...state, page }).forEach(([key, value]) => {
    if (value !== "" && !(key === "page" && value === 0)) params.set(key === "query" ? "q" : key, String(value));
  });
  return `/project-market?${params.toString()}`;
}

export default async function ProjectMarketList({ state }: ProjectMarketListProps) {
  const { query } = state;
  const result = await getProjectMarketPage(state);
  const { projects } = result;

  if (projects.length === 0) {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center gap-4 border-y border-slate-300 px-6 text-center text-sm text-slate-600">
        <p>
          {query
            ? `“${query}”에 해당하는 판매 프로젝트가 없습니다.`
            : "아직 등록된 판매 프로젝트가 없습니다."}
        </p>
        {query ? (
          <Link
            href="/project-market"
            className="font-bold text-brand underline decoration-brand-accent underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-accent"
          >
            전체 프로젝트 보기
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <p className="text-sm text-slate-600">
          {query ? `“${query}” 검색 결과 ` : "등록 프로젝트 "}
          <strong className="font-bold tabular-nums text-slate-900">
            {result.totalElements.toLocaleString("ko-KR")}개
          </strong>
        </p>
      </div>
      <ul className="mt-4 divide-y divide-slate-300 border-y border-slate-300">
        {projects.map((project) => (
          <li key={project.id}>
            <ProjectMarketCard project={project} />
          </li>
        ))}
      </ul>
      {result.totalPages > 1 ? <nav aria-label="판매 프로젝트 목록 페이지" className="mt-6 flex items-center justify-between text-sm">{result.page > 0 ? <Link href={pageHref(state, result.page - 1)} className="font-bold text-brand underline underline-offset-4">이전</Link> : <span />}<span><strong>{result.page + 1}</strong> / {result.totalPages}</span>{result.page + 1 < result.totalPages ? <Link href={pageHref(state, result.page + 1)} className="font-bold text-brand underline underline-offset-4">다음</Link> : <span />}</nav> : null}
    </div>
  );
}

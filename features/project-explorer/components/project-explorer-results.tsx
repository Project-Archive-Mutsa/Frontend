import { getProjectExplorerItems } from "@/features/project-explorer/api/get-project-explorer-items";
import Link from "next/link";
import type { ProjectExplorerSearchState } from "@/features/project-explorer/model/types";
import ProjectCatalogCard from "./project-catalog-card";

interface ProjectExplorerResultsProps { state: ProjectExplorerSearchState }

function getPageHref(state: ProjectExplorerSearchState, page: number) {
  const params = new URLSearchParams();
  Object.entries({ ...state, page }).forEach(([key, value]) => {
    if (value !== "" && !(key === "page" && value === 0)) params.set(key === "query" ? "q" : key, String(value));
  });
  return `/projects?${params.toString()}`;
}

export default async function ProjectExplorerResults({ state }: ProjectExplorerResultsProps) {
  const { projects, totalElements, totalPages } = await getProjectExplorerItems(state);
  const { query } = state;
  const resultLabel = query ? `“${query}” 검색 결과` : "현재 많이 본 프로젝트";

  if (projects.length === 0) {
    return (
      <div className="flex min-h-56 items-center justify-center border-y border-slate-300 px-6 text-center text-sm leading-6 text-slate-600">
        {query
          ? `“${query}”와 일치하는 프로젝트가 없습니다. 검색어를 바꿔 다시 찾아보세요.`
          : "현재 확인할 수 있는 프로젝트가 없습니다."}
      </div>
    );
  }

  return (
    <section aria-labelledby="project-result-heading">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="project-result-heading"
            className="text-xl font-bold tracking-[-0.025em] text-slate-950"
          >
            {resultLabel}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            기본정보를 비교하고 관심 있는 프로젝트를 저장해 보세요.
          </p>
        </div>
        <p className="text-sm text-slate-600">
          총{" "}
          <strong className="font-bold tabular-nums text-slate-950">
            {totalElements.toLocaleString("ko-KR")}개
          </strong>
        </p>
      </header>

      <ul className="mt-5 divide-y divide-slate-300 border-y border-slate-300">
        {projects.map((project) => (
          <li key={project.id}>
            <ProjectCatalogCard project={project} />
          </li>
        ))}
      </ul>
      {totalPages > 1 ? (
        <nav aria-label="프로젝트 목록 페이지" className="mt-6 flex items-center justify-between text-sm">
          {state.page > 0 ? <Link href={getPageHref(state, state.page - 1)} className="font-bold text-brand underline underline-offset-4">이전</Link> : <span />}
          <span className="text-slate-600"><strong className="text-slate-900">{state.page + 1}</strong> / {totalPages}</span>
          {state.page + 1 < totalPages ? <Link href={getPageHref(state, state.page + 1)} className="font-bold text-brand underline underline-offset-4">다음</Link> : <span />}
        </nav>
      ) : null}
    </section>
  );
}

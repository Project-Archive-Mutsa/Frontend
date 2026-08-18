import { getProjectExplorerItems } from "@/features/project-explorer/api/get-project-explorer-items";
import BackendContractNotice from "@/shared/components/backend-contract-notice/backend-contract-notice";
import ProjectCatalogCard from "./project-catalog-card";

interface ProjectExplorerResultsProps {
  query: string;
}

export default async function ProjectExplorerResults({
  query,
}: ProjectExplorerResultsProps) {
  const projects = await getProjectExplorerItems(query);
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
            {projects.length.toLocaleString("ko-KR")}개
          </strong>
        </p>
      </header>

      <div className="mt-5">
        <BackendContractNotice>
          출품 행사·등록 목적·결과물 단계·활동 상태·자산·수상 이력과 정보 충실도 응답 필드가 필요합니다.
        </BackendContractNotice>
      </div>

      <ul className="mt-5 divide-y divide-slate-300 border-y border-slate-300">
        {projects.map((project) => (
          <li key={project.id}>
            <ProjectCatalogCard project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}

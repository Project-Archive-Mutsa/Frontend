import Link from "next/link";
import { getProjectMarketProjects } from "@/features/project-market/api/get-project-market-projects";
import { getProjectMarketSearchResults } from "@/features/project-market/api/get-project-market-search-results";
import BackendContractNotice from "@/shared/components/backend-contract-notice/backend-contract-notice";
import ProjectMarketCard from "./project-market-card";

interface ProjectMarketListProps {
  query?: string;
}

export default async function ProjectMarketList({
  query = "",
}: ProjectMarketListProps = {}) {
  const projects = query
    ? await getProjectMarketSearchResults(query)
    : await getProjectMarketProjects();

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
            {projects.length.toLocaleString("ko-KR")}개
          </strong>
        </p>
      </div>
      <div className="mt-4">
        <BackendContractNotice>
          판매 자산 목록·포인트 단위·가격 조건·권리 범위와 공통 출품 정보를 제공하는 판매 요약 API가 필요합니다.
        </BackendContractNotice>
      </div>
      <ul className="mt-4 divide-y divide-slate-300 border-y border-slate-300">
        {projects.map((project) => (
          <li key={project.id}>
            <ProjectMarketCard project={project} />
          </li>
        ))}
      </ul>
    </div>
  );
}

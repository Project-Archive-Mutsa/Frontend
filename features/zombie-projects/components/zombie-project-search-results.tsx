import { getZombieProjectSearchResults } from "@/features/zombie-projects/api/get-zombie-project-search-results";
import BackendContractNotice from "@/shared/components/backend-contract-notice/backend-contract-notice";
import ZombieProjectItem from "./zombie-project-item";
import ZombieProjectSearchResultItem from "./zombie-project-search-result-item";

interface ZombieProjectSearchResultsProps {
  query: string;
}

export default async function ZombieProjectSearchResults({
  query,
}: ZombieProjectSearchResultsProps) {
  const results = await getZombieProjectSearchResults(query);

  if (results.projects.length === 0) {
    return (
      <div>
        <header className="border-b border-slate-300 pb-5">
          <h2 className="text-xl font-bold tracking-[-0.025em] text-slate-900">
            &ldquo;{results.query || query}&rdquo; 검색 결과
          </h2>
          <p className="mt-2 text-sm text-slate-600">총 0개의 프로젝트</p>
        </header>
        <p className="flex min-h-56 items-center justify-center border-b border-slate-300 px-6 text-center text-sm leading-6 text-slate-600">
          프로젝트명과 일치하는 결과가 없습니다. 철자나 검색어를 바꿔 다시 찾아보세요.
        </p>
      </div>
    );
  }

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-300 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-[-0.025em] text-slate-900">
            &ldquo;{results.query || query}&rdquo; 검색 결과
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            프로젝트의 기능과 기술적 특징을 중심으로 비교합니다.
          </p>
        </div>
        <p className="text-sm text-slate-600">
          총 <strong className="font-bold text-slate-900">{results.totalCount.toLocaleString("ko-KR")}</strong>개
        </p>
      </header>

      <div className="mt-4">
        <BackendContractNotice>
          현재 검색 응답은 파일 분석과 일반 프로젝트가 혼재합니다. 좀비 공개 자산·라이선스·출품 맥락·정보 충실도를 포함한 통합 검색 응답이 필요합니다.
        </BackendContractNotice>
      </div>

      <ol className="divide-y divide-slate-300 border-b border-slate-300">
        {results.projects.map((result, index) => (
          <li
            key={
              result.kind === "catalog"
                ? `catalog-${result.project.id}`
                : `analysis-${result.project.projectTitle}-${index}`
            }
          >
            {result.kind === "catalog" ? (
              <ZombieProjectItem project={result.project} headingLevel={3} />
            ) : (
              <ZombieProjectSearchResultItem project={result.project} />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

import { getZombieProjectSearchResults } from "@/features/zombie-projects/api/get-zombie-project-search-results";
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
        <header className="border-b border-[#cfdae4] pb-5">
          <h2 className="text-xl font-bold tracking-[-0.025em] text-[#24445f]">
            &ldquo;{results.query || query}&rdquo; 검색 결과
          </h2>
          <p className="mt-2 text-sm text-[#60778b]">총 0개의 프로젝트</p>
        </header>
        <p className="flex min-h-56 items-center justify-center border-b border-[#cfdae4] px-6 text-center text-sm leading-6 text-[#5d7285]">
          프로젝트명과 일치하는 결과가 없습니다. 철자나 검색어를 바꿔 다시 찾아보세요.
        </p>
      </div>
    );
  }

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-[#cfdae4] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-[-0.025em] text-[#24445f]">
            &ldquo;{results.query || query}&rdquo; 검색 결과
          </h2>
          <p className="mt-2 text-sm text-[#60778b]">
            프로젝트의 기능과 기술적 특징을 중심으로 비교합니다.
          </p>
        </div>
        <p className="text-sm text-[#60778b]">
          총 <strong className="font-bold text-[#24445f]">{results.totalCount.toLocaleString("ko-KR")}</strong>개
        </p>
      </header>

      <ol className="divide-y divide-[#cfdae4] border-b border-[#cfdae4]">
        {results.projects.map((result, index) => (
          <li
            key={
              result.kind === "catalog"
                ? `catalog-${result.project.id}`
                : `analysis-${result.project.projectTitle}-${index}`
            }
          >
            {result.kind === "catalog" ? (
              <ZombieProjectItem project={result.project} />
            ) : (
              <ZombieProjectSearchResultItem project={result.project} />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

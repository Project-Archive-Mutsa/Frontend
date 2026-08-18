import { getProjectDiscoveryResults } from "@/features/project-discovery/api/get-project-discovery-results";
import BackendContractNotice from "@/shared/components/backend-contract-notice/backend-contract-notice";
import ProjectDiscoveryResultList from "./project-discovery-result-list";
import ProjectDiscoverySummary from "./project-discovery-summary";

interface ProjectDiscoveryResultsProps {
  query: string;
}

export default async function ProjectDiscoveryResults({
  query,
}: ProjectDiscoveryResultsProps) {
  const data = await getProjectDiscoveryResults(query);
  const groups = [
    {
      id: "project-results",
      title: "프로젝트",
      description: "아카이브에 등록된 출품 프로젝트를 함께 비교합니다.",
      items: data.projects,
    },
    {
      id: "contest-results",
      title: "공모전",
      description: "비슷한 주제와 문제를 다루는 공모전을 확인합니다.",
      items: data.contests,
    },
    {
      id: "idea-results",
      title: "아이디어",
      description: "아직 프로젝트로 발전하기 전의 관련 아이디어를 살펴봅니다.",
      items: data.ideas,
    },
    {
      id: "award-results",
      title: "수상작",
      description: "유사한 문제를 해결해 평가받은 수상 사례를 확인합니다.",
      items: data.awards,
    },
  ] as const;

  return (
    <div className="space-y-14 sm:space-y-16">
      <ProjectDiscoverySummary data={data} />

      <div>
        <BackendContractNotice>
          프로젝트별 출품 정보·단계·상태·자산·수상 이력·정보 충실도와 유사도 근거·차이점·검증 과제 응답이 필요합니다.
        </BackendContractNotice>
      </div>

      <nav aria-label="검색 결과 유형" className="border-y border-slate-300">
        <ul className="grid grid-cols-2 sm:grid-cols-4">
          {groups.map((group, index) => (
            <li
              key={group.id}
              className={`${index < 2 ? "border-b" : ""} ${index % 2 === 0 ? "border-r" : ""} border-slate-300 sm:border-r sm:border-b-0 sm:last:border-r-0`}
            >
              <a
                href={`#${group.id}`}
                className="flex min-h-14 items-center justify-between gap-3 px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand sm:px-5"
              >
                <span>{group.title}</span>
                <span className="tabular-nums text-slate-500">
                  {group.items.length.toLocaleString("ko-KR")}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {groups.map((group) => (
        <ProjectDiscoveryResultList key={group.id} {...group} />
      ))}
    </div>
  );
}

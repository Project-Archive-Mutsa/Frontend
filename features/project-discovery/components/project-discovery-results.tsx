import { getProjectDiscoveryDemoResults } from "@/features/project-discovery/data/project-discovery-demo-data";
import ProjectDiscoveryResultList from "./project-discovery-result-list";
import ProjectDiscoverySummary from "./project-discovery-summary";

interface ProjectDiscoveryResultsProps {
  query: string;
}

export default function ProjectDiscoveryResults({
  query,
}: ProjectDiscoveryResultsProps) {
  const data = getProjectDiscoveryDemoResults(query);

  return (
    <div className="space-y-12 sm:space-y-14">
      <ProjectDiscoverySummary
        query={data.query}
        analysis={data.analysis}
        projects={data.projects}
      />

      <ProjectDiscoveryResultList
        id="project-results"
        title="유사 프로젝트"
        description="입력한 검색어와의 유사도가 높은 순서로 비교합니다. 유사도는 아이디어의 우수성이나 동일성을 뜻하지 않습니다."
        query={data.query}
        items={data.projects}
      />
    </div>
  );
}

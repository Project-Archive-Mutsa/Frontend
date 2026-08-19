import type {
  ProjectDiscoveryResultsData,
  ProjectDiscoveryResultsResponse,
} from "@/features/project-discovery/types";

const PROJECT_DISCOVERY_RESULTS_PATH = "/api/ai/project-discovery/results";

export async function getProjectDiscoveryResults(
  query: string,
): Promise<ProjectDiscoveryResultsData> {
  const searchParams = new URLSearchParams({ query });
  const response = await fetch(
    `${process.env.API_BASE_URL}${PROJECT_DISCOVERY_RESULTS_PATH}?${searchParams}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(`AI 검색 결과 조회에 실패했습니다. (${response.status})`);
  }

  const result = (await response.json()) as ProjectDiscoveryResultsResponse;

  if (
    !result.success ||
    !result.data ||
    !Array.isArray(result.data.projects) ||
    !Array.isArray(result.data.contests) ||
    !Array.isArray(result.data.ideas) ||
    !Array.isArray(result.data.awards)
  ) {
    throw new Error(result.message ?? "AI 검색 결과 응답 형식이 올바르지 않습니다.");
  }

  return result.data;
}

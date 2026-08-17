import type {
  RecentAwardProject,
  RecentAwardProjectsResponse,
} from "@/features/recent-award-projects/types";
import { mapRecentAwardProject } from "./map-recent-award-project";

const RECENT_AWARD_PROJECTS_PATH = "/api/awards/recent";

export async function getRecentAwardProjects(): Promise<
  readonly RecentAwardProject[]
> {
  const response = await fetch(
    `${process.env.API_BASE_URL}${RECENT_AWARD_PROJECTS_PATH}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`최근 수상작 조회에 실패했습니다. (${response.status})`);
  }

  const result = (await response.json()) as RecentAwardProjectsResponse;

  if (!result.success || !Array.isArray(result.data)) {
    throw new Error(
      result.message ?? "최근 수상작 응답 형식이 올바르지 않습니다.",
    );
  }

  return result.data.map(mapRecentAwardProject);
}

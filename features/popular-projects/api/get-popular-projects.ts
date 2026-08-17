import type {
  PopularProject,
  PopularProjectsResponse,
} from "@/features/popular-projects/types";
import { mapPopularProject } from "./map-popular-project";

const POPULAR_PROJECTS_PATH = "/api/projects/popular";

export async function getPopularProjects(): Promise<readonly PopularProject[]> {
  const response = await fetch(
    `${process.env.API_BASE_URL}${POPULAR_PROJECTS_PATH}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`인기 프로젝트 조회에 실패했습니다. (${response.status})`);
  }

  const result = (await response.json()) as PopularProjectsResponse;

  if (!result.success || !Array.isArray(result.data)) {
    throw new Error(
      result.message ?? "인기 프로젝트 응답 형식이 올바르지 않습니다.",
    );
  }

  return result.data.map(mapPopularProject);
}

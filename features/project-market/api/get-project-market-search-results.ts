import { z } from "zod";
import type { ProjectMarketProject } from "@/features/project-market/types";
import { getProjectMarketProjects } from "./get-project-market-projects";
import { mapProjectMarketProject } from "./map-project-market-project";
import { projectMarketProjectResponseItemSchema } from "./project-market-response-schema";

const PROJECT_SEARCH_PATH = "/api/projects/search";

const projectSearchResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  message: z.string().nullable().optional(),
});

const projectSearchResultsSchema = z.object({
  query: z.string(),
  totalCount: z.number().int().nonnegative(),
  projects: z.array(projectMarketProjectResponseItemSchema),
});

export async function getProjectMarketSearchResults(
  query: string,
): Promise<readonly ProjectMarketProject[]> {
  const searchUrl = new URL(PROJECT_SEARCH_PATH, process.env.API_BASE_URL);
  searchUrl.searchParams.set("q", query);

  const [response, saleProjects] = await Promise.all([
    fetch(searchUrl.toString(), { cache: "no-store" }),
    getProjectMarketProjects(),
  ]);

  if (!response.ok) {
    throw new Error(`프로젝트 검색에 실패했습니다. (${response.status})`);
  }

  const parsedResponse = projectSearchResponseSchema.safeParse(
    await response.json(),
  );

  if (!parsedResponse.success) {
    throw new Error("프로젝트 검색 응답 형식이 올바르지 않습니다.");
  }

  if (!parsedResponse.data.success) {
    throw new Error(
      parsedResponse.data.message ?? "프로젝트를 검색하지 못했습니다.",
    );
  }

  const parsedResults = projectSearchResultsSchema.safeParse(
    parsedResponse.data.data,
  );

  if (!parsedResults.success) {
    throw new Error("프로젝트 검색 응답 형식이 올바르지 않습니다.");
  }

  const saleProjectIds = new Set(saleProjects.map((project) => project.id));

  return parsedResults.data.projects
    .filter((project) => saleProjectIds.has(project.projectId))
    .map(mapProjectMarketProject);
}

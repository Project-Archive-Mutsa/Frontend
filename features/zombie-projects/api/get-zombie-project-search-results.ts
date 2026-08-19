import { z } from "zod";
import type {
  ZombieProjectSearchResult,
  ZombieProjectSearchResults,
} from "@/features/zombie-projects/types";
import { mapZombieProject } from "./map-zombie-project";
import { zombieProjectResponseItemSchema } from "./zombie-project-response-schema";

const ZOMBIE_PROJECT_SEARCH_PATH = "/api/projects/search";

const zombieProjectSearchResultSchema: z.ZodType<ZombieProjectSearchResult> =
  z.object({
    projectTitle: z.string(),
    totalFiles: z.number().int().nonnegative(),
    selectedFiles: z.array(
      z.object({
        path: z.string(),
        extension: z.string(),
        kind: z.string(),
        size: z.number().int().nonnegative(),
      }),
    ),
    functionalSummary: z.array(z.string()),
    differentiators: z.array(z.string()),
    technicalStrengths: z.array(z.string()),
    futureDirections: z.array(z.string()),
    sections: z.array(
      z.object({
        title: z.string(),
        items: z.array(z.string()),
      }),
    ),
  });

const zombieProjectSearchResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  message: z.string().nullable().optional(),
});

const zombieProjectSearchResultsSchema = z.object({
  query: z.string(),
  totalCount: z.number().int().nonnegative(),
  projects: z.array(
    z.union([
      zombieProjectSearchResultSchema,
      zombieProjectResponseItemSchema,
    ]),
  ),
});

export async function getZombieProjectSearchResults(
  query: string,
): Promise<ZombieProjectSearchResults> {
  const url = new URL(
    ZOMBIE_PROJECT_SEARCH_PATH,
    process.env.API_BASE_URL,
  );
  url.searchParams.set("q", query);

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`좀비 프로젝트 검색에 실패했습니다. (${response.status})`);
  }

  const parsedResponse = zombieProjectSearchResponseSchema.safeParse(
    await response.json(),
  );

  if (!parsedResponse.success) {
    throw new Error("좀비 프로젝트 검색 응답 형식이 올바르지 않습니다.");
  }

  if (!parsedResponse.data.success) {
    throw new Error(
      parsedResponse.data.message ?? "좀비 프로젝트를 검색하지 못했습니다.",
    );
  }

  const parsedResults = zombieProjectSearchResultsSchema.safeParse(
    parsedResponse.data.data,
  );

  if (!parsedResults.success) {
    throw new Error("좀비 프로젝트 검색 응답 형식이 올바르지 않습니다.");
  }

  return {
    query: parsedResults.data.query,
    totalCount: parsedResults.data.totalCount,
    projects: parsedResults.data.projects.map((project) =>
      "projectId" in project
        ? {
            kind: "catalog" as const,
            project: mapZombieProject(project),
          }
        : {
            kind: "analysis" as const,
            project,
          },
    ),
  } satisfies ZombieProjectSearchResults;
}

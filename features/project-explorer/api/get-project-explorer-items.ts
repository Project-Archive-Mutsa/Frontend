import { z } from "zod";
import type { ArchiveProjectItem } from "@/features/project-explorer/model/types";
import { mapArchiveProject } from "./map-project-explorer-item";
import {
  projectExplorerEnvelopeSchema,
  projectExplorerResponseItemSchema,
  projectExplorerSearchDataSchema,
} from "./project-explorer-response-schema";

const POPULAR_PROJECTS_PATH = "/api/projects/popular";
const PROJECT_SEARCH_PATH = "/api/projects/search";

async function fetchEnvelope(url: string) {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`프로젝트 조회에 실패했습니다. (${response.status})`);
  }

  const parsedEnvelope = projectExplorerEnvelopeSchema.safeParse(
    await response.json(),
  );

  if (!parsedEnvelope.success) {
    throw new Error("프로젝트 응답 형식이 올바르지 않습니다.");
  }

  if (!parsedEnvelope.data.success) {
    throw new Error(
      parsedEnvelope.data.message ?? "프로젝트를 조회하지 못했습니다.",
    );
  }

  return parsedEnvelope.data.data;
}

export async function getProjectExplorerItems(
  query: string,
): Promise<readonly ArchiveProjectItem[]> {
  const normalizedQuery = query.trim();

  if (normalizedQuery) {
    const url = new URL(PROJECT_SEARCH_PATH, process.env.API_BASE_URL);
    url.searchParams.set("q", normalizedQuery);
    const data = await fetchEnvelope(url.toString());
    const parsedSearch = projectExplorerSearchDataSchema.safeParse(data);

    if (!parsedSearch.success) {
      throw new Error("프로젝트 검색 응답 형식이 올바르지 않습니다.");
    }

    return parsedSearch.data.projects.map(mapArchiveProject);
  }

  const data = await fetchEnvelope(
    `${process.env.API_BASE_URL}${POPULAR_PROJECTS_PATH}`,
  );
  const parsedProjects = z
    .array(projectExplorerResponseItemSchema)
    .safeParse(data);

  if (!parsedProjects.success) {
    throw new Error("인기 프로젝트 응답 형식이 올바르지 않습니다.");
  }

  return parsedProjects.data.map(mapArchiveProject);
}

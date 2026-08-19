import { z } from "zod";
import type { ProjectMarketProject } from "@/features/project-market/types";
import { mapProjectMarketProject } from "./map-project-market-project";
import { projectMarketProjectResponseItemSchema } from "./project-market-response-schema";

const PROJECT_MARKET_PATH = "/api/projects/sell";

const projectMarketProjectsResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  message: z.string().nullable().optional(),
});

export async function getProjectMarketProjects(): Promise<
  readonly ProjectMarketProject[]
> {
  const response = await fetch(
    `${process.env.API_BASE_URL}${PROJECT_MARKET_PATH}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`판매 프로젝트 조회에 실패했습니다. (${response.status})`);
  }

  const parsedResponse = projectMarketProjectsResponseSchema.safeParse(
    await response.json(),
  );

  if (!parsedResponse.success) {
    throw new Error("판매 프로젝트 응답 형식이 올바르지 않습니다.");
  }

  if (!parsedResponse.data.success) {
    throw new Error(
      parsedResponse.data.message ?? "판매 프로젝트를 조회하지 못했습니다.",
    );
  }

  const parsedProjects = z
    .array(projectMarketProjectResponseItemSchema)
    .safeParse(parsedResponse.data.data);

  if (!parsedProjects.success) {
    throw new Error("판매 프로젝트 응답 형식이 올바르지 않습니다.");
  }

  return parsedProjects.data.map(mapProjectMarketProject);
}

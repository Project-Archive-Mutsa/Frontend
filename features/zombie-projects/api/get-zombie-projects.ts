import { z } from "zod";
import type { ZombieProject } from "@/features/zombie-projects/types";
import { mapZombieProject } from "./map-zombie-project";
import { zombieProjectResponseItemSchema } from "./zombie-project-response-schema";

const ZOMBIE_PROJECTS_PATH = "/api/projects/zombie";

const zombieProjectsResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  message: z.string().nullable().optional(),
});

export async function getZombieProjects(): Promise<
  readonly ZombieProject[]
> {
  const response = await fetch(
    `${process.env.API_BASE_URL}${ZOMBIE_PROJECTS_PATH}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`좀비 프로젝트 조회에 실패했습니다. (${response.status})`);
  }

  const parsedResponse = zombieProjectsResponseSchema.safeParse(
    await response.json(),
  );

  if (!parsedResponse.success) {
    throw new Error("좀비 프로젝트 응답 형식이 올바르지 않습니다.");
  }

  if (!parsedResponse.data.success) {
    throw new Error(
      parsedResponse.data.message ?? "좀비 프로젝트를 조회하지 못했습니다.",
    );
  }

  const parsedProjects = z
    .array(zombieProjectResponseItemSchema)
    .safeParse(parsedResponse.data.data);

  if (!parsedProjects.success) {
    throw new Error("좀비 프로젝트 응답 형식이 올바르지 않습니다.");
  }

  return parsedProjects.data.map(mapZombieProject);
}

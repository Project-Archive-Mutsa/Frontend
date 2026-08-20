import { z } from "zod";
import { getApiError, readJson } from "@/shared/api/api-error";
import { getClientApiUrl } from "@/shared/api/client-api-url";

const schema = z.object({
  success: z.literal(true),
  data: z.object({
    projects: z.array(z.object({ projectId: z.number().int().positive() })),
  }),
});

export async function getBookmarkedProjectIds() {
  const response = await fetch(getClientApiUrl("/api/my/like-projects"), { credentials: "include" });
  const payload = await readJson(response);
  if (!response.ok) throw getApiError(payload, response.status, "관심 프로젝트 상태를 확인하지 못했습니다.");
  const parsed = schema.safeParse(payload);
  if (!parsed.success) throw new Error("관심 프로젝트 응답 형식이 올바르지 않습니다.");
  return new Set(parsed.data.data.projects.map((project) => project.projectId));
}

import { z } from "zod";
import { getApiError, readJson } from "@/shared/api/api-error";
import { getClientApiUrl } from "@/shared/api/client-api-url";

const responseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    projectId: z.number().int().positive(),
    bookmarked: z.boolean(),
    bookmarkCount: z.number().int().nonnegative(),
  }),
});

export async function toggleProjectBookmark(projectId: number) {
  const response = await fetch(
    getClientApiUrl(`/api/projects/${projectId}/bookmark`),
    { method: "POST", credentials: "include" },
  );
  const payload = await readJson(response);
  if (!response.ok) {
    throw getApiError(payload, response.status, "북마크를 변경하지 못했습니다.");
  }
  const parsed = responseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("북마크 응답 형식이 올바르지 않습니다.");
  }
  return parsed.data.data;
}

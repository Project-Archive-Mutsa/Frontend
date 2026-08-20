import { z } from "zod";
import { getApiError, readJson } from "@/shared/api/api-error";
import { getClientApiUrl } from "@/shared/api/client-api-url";

const responseSchema = z.object({
  success: z.boolean(),
  message: z.string().nullable().optional(),
  data: z.object({ applicationId: z.number().int(), status: z.string() }).optional(),
});

export async function applyToRecruitment(recruitmentId: number, role: string, message: string) {
  const response = await fetch(getClientApiUrl(`/api/recruitments/${recruitmentId}/applications`), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, message }),
  });
  const payload = await readJson(response);
  if (!response.ok) throw getApiError(payload, response.status, "지원에 실패했습니다.");
  const parsed = responseSchema.safeParse(payload);
  if (!parsed.success || !parsed.data.success || !parsed.data.data) throw new Error("지원 응답 형식이 올바르지 않습니다.");
  return parsed.data.data;
}

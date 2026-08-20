import { z } from "zod";
import { getMyRecruitmentApplications } from "./get-my-recruitment-applications";
import { recruitmentApplicationSchema } from "./recruitment-application-schema";
import { getApiError, readJson } from "@/shared/api/api-error";
import { getClientApiUrl } from "@/shared/api/client-api-url";

const responseSchema = z.object({
  success: z.literal(true),
  data: recruitmentApplicationSchema.nullable(),
  message: z.string().nullable().optional(),
});

const unmappedRouteSchema = z.object({
  status: z.literal(404),
  error: z.literal("Not Found"),
  path: z.string(),
});

export async function getMyRecruitmentApplication(recruitmentId: number) {
  const path = `/api/recruitments/${recruitmentId}/applications/me`;
  const response = await fetch(getClientApiUrl(path), {
    credentials: "include",
  });
  const payload = await readJson(response);

  if (response.status === 404) {
    const unmappedRoute = unmappedRouteSchema.safeParse(payload);

    if (unmappedRoute.success && unmappedRoute.data.path === path) {
      const applications = await getMyRecruitmentApplications();
      return (
        applications.find(
          (application) => application.recruitmentId === recruitmentId,
        ) ?? null
      );
    }

    return null;
  }

  if (!response.ok) {
    throw getApiError(
      payload,
      response.status,
      "팀 지원 상태를 확인하지 못했습니다.",
    );
  }

  const parsed = responseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("팀 지원 상태 응답 형식이 올바르지 않습니다.");
  }

  return parsed.data.data;
}

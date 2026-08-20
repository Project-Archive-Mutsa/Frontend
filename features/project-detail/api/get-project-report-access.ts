import { z } from "zod";
import { getApiError, readJson } from "@/shared/api/api-error";
import { getClientApiUrl } from "@/shared/api/client-api-url";
import { fetchWithTimeout } from "@/shared/api/fetch-with-timeout";

const schema = z.object({
  success: z.literal(true),
  data: z.object({
    projectId: z.number().int().positive(),
    status: z.enum(["LOCKED", "GRANTED", "OWNER", "UNAVAILABLE"]),
    price: z.number().int().nonnegative().nullable(),
    reportVersion: z.number().int().nonnegative().nullable(),
    purchaseEnabled: z.boolean(),
    unavailableReason: z.string().nullable(),
    purchasedAt: z.string().nullable(),
  }),
});

export async function getProjectReportAccess(
  projectId: number,
  signal?: AbortSignal,
) {
  const response = await fetchWithTimeout(getClientApiUrl(`/api/projects/${projectId}/report-access`), {
    credentials: "include",
    signal,
  }, "프로젝트 상세 정보 열람 상태 확인이 지연되고 있습니다. 다시 시도해 주세요.");
  const payload = await readJson(response);

  if (response.status === 404) {
    return {
      projectId,
      status: "UNAVAILABLE" as const,
      price: null,
      reportVersion: null,
      purchaseEnabled: false,
      unavailableReason: "REPORT_OFFER_NOT_FOUND",
      purchasedAt: null,
    };
  }

  if (!response.ok) throw getApiError(payload, response.status, "프로젝트 상세 정보 열람 상태를 확인하지 못했습니다.");
  const parsed = schema.safeParse(payload);
  if (!parsed.success) throw new Error("프로젝트 상세 정보 열람 상태 응답 형식이 올바르지 않습니다.");
  return parsed.data.data;
}

import { z } from "zod";
import { getApiError, readJson } from "@/shared/api/api-error";
import { getClientApiUrl } from "@/shared/api/client-api-url";
import { fetchWithTimeout } from "@/shared/api/fetch-with-timeout";

const schema = z.object({
  success: z.literal(true),
  data: z.object({
    purchaseId: z.number().int().positive(),
    projectId: z.number().int().positive(),
    entitlementId: z.number().int().positive(),
    paidPoint: z.number().int().nonnegative(),
    balance: z.number().int().nonnegative(),
    accessStatus: z.enum(["GRANTED", "OWNER"]),
    reportVersion: z.number().int().nonnegative(),
    purchasedAt: z.string(),
  }),
});

export async function purchaseProjectReport(projectId: number, idempotencyKey: string) {
  const response = await fetchWithTimeout(getClientApiUrl(`/api/projects/${projectId}/report-purchases`), {
    method: "POST",
    credentials: "include",
    headers: { "Idempotency-Key": idempotencyKey },
  }, "프로젝트 상세 정보 열람 처리가 지연되고 있습니다. 결제 내역을 확인한 뒤 다시 시도해 주세요.");
  const payload = await readJson(response);
  if (!response.ok) throw getApiError(payload, response.status, "프로젝트 상세 정보 열람에 실패했습니다.");
  const parsed = schema.safeParse(payload);
  if (!parsed.success) throw new Error("프로젝트 상세 정보 열람 응답 형식이 올바르지 않습니다.");
  return parsed.data.data;
}

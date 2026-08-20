import { z } from "zod";
import { getApiError, readJson } from "@/shared/api/api-error";
import { getClientApiUrl } from "@/shared/api/client-api-url";
import { fetchWithTimeout } from "@/shared/api/fetch-with-timeout";

const purchaseResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().nullable().optional(),
  data: z.object({
    projectId: z.number().int(),
    projectName: z.string(),
    paidPoint: z.number().int().nonnegative(),
    buyerId: z.number().int().positive(),
    sellerId: z.number().int().positive(),
    buyerBalance: z.number().int().nonnegative(),
    sellerBalance: z.number().int().nonnegative(),
  }).optional(),
});

export async function purchaseProject(projectId: number) {
  const response = await fetchWithTimeout(getClientApiUrl(`/api/projects/${projectId}/purchase`), {
    method: "POST",
    credentials: "include",
  }, "프로젝트 구매 처리가 지연되고 있습니다. 결제 내역을 확인한 뒤 다시 시도해 주세요.");
  const payload = await readJson(response);
  if (!response.ok) throw getApiError(payload, response.status, "프로젝트 구매에 실패했습니다.");
  const parsed = purchaseResponseSchema.safeParse(payload);
  if (!parsed.success || !parsed.data.success || !parsed.data.data) throw new Error("프로젝트 구매 응답 형식이 올바르지 않습니다.");
  return parsed.data.data;
}

import { z } from "zod";
import { getApiError, readJson } from "@/shared/api/api-error";
import { getClientApiUrl } from "@/shared/api/client-api-url";
import { fetchWithTimeout } from "@/shared/api/fetch-with-timeout";

const balanceSchema = z.object({
  totalPoint: z.number().int().nonnegative(),
  availablePoint: z.number().int().nonnegative(),
});

const envelopeSchema = z.object({
  success: z.literal(true),
  data: balanceSchema,
});

export async function getMyPointBalance(signal?: AbortSignal) {
  const response = await fetchWithTimeout(
    getClientApiUrl("/api/members/me/points"),
    { credentials: "include", signal },
    "포인트 잔액 확인이 지연되고 있습니다. 다시 시도해 주세요.",
  );

  const payload = await readJson(response);
  if (!response.ok) throw getApiError(payload, response.status, "포인트 잔액을 불러오지 못했습니다.");
  const direct = balanceSchema.safeParse(payload);
  if (direct.success) return direct.data;

  const enveloped = envelopeSchema.safeParse(payload);
  if (enveloped.success) return enveloped.data.data;

  throw new Error("포인트 잔액 응답 형식이 올바르지 않습니다.");
}

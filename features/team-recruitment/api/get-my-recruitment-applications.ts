import { z } from "zod";
import { recruitmentApplicationSchema } from "./recruitment-application-schema";
import { getApiError, readJson } from "@/shared/api/api-error";
import { getClientApiUrl } from "@/shared/api/client-api-url";

const arrayEnvelopeSchema = z.object({
  success: z.literal(true),
  data: z.array(recruitmentApplicationSchema),
  message: z.string().nullable().optional(),
});

const pageEnvelopeSchema = z.object({
  success: z.literal(true),
  data: z.object({ content: z.array(recruitmentApplicationSchema) }),
  message: z.string().nullable().optional(),
});

export async function getMyRecruitmentApplications() {
  const response = await fetch(
    getClientApiUrl("/api/me/recruitment-applications?page=0&size=100"),
    { credentials: "include" },
  );
  const payload = await readJson(response);

  if (!response.ok) {
    throw getApiError(
      payload,
      response.status,
      "팀 지원내역을 불러오지 못했습니다.",
    );
  }

  const arrayEnvelope = arrayEnvelopeSchema.safeParse(payload);
  if (arrayEnvelope.success) return arrayEnvelope.data.data;

  const pageEnvelope = pageEnvelopeSchema.safeParse(payload);
  if (pageEnvelope.success) return pageEnvelope.data.data.content;

  throw new Error("팀 지원내역 응답 형식이 올바르지 않습니다.");
}

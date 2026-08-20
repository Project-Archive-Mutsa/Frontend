import { z } from "zod";
import { getApiError, readJson } from "@/shared/api/api-error";
import { getClientApiUrl } from "@/shared/api/client-api-url";
import { fetchWithTimeout } from "@/shared/api/fetch-with-timeout";

const schema = z.object({
  success: z.literal(true),
  data: z.object({
    projectId: z.number().int().positive(),
    reportVersion: z.number().int().nonnegative(),
    sections: z.array(z.object({
      detailPageId: z.number().int().positive(),
      title: z.string(),
      intro: z.string().nullable(),
      content: z.string().nullable(),
      visibility: z.string(),
      assetCount: z.number().int().nonnegative(),
    })),
    links: z.array(z.object({
      linkId: z.number().int().positive(),
      linkType: z.string(),
      url: z.string(),
      accessRequirement: z.string().nullable(),
    })),
  }),
});

export async function getProjectReport(projectId: number, signal?: AbortSignal) {
  const response = await fetchWithTimeout(getClientApiUrl(`/api/projects/${projectId}/report`), { credentials: "include", signal }, "프로젝트 상세 정보를 불러오는 데 시간이 오래 걸리고 있습니다. 다시 시도해 주세요.");
  const payload = await readJson(response);
  if (!response.ok) throw getApiError(payload, response.status, "프로젝트 상세 정보를 불러오지 못했습니다.");
  const parsed = schema.safeParse(payload);
  if (!parsed.success) throw new Error("프로젝트 상세 정보 응답 형식이 올바르지 않습니다.");
  return parsed.data.data;
}

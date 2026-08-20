import { z } from "zod";
import { getApiError, readJson } from "@/shared/api/api-error";
import { getClientApiUrl } from "@/shared/api/client-api-url";
import { fetchWithTimeout } from "@/shared/api/fetch-with-timeout";

const schema = z.object({
  success: z.literal(true),
  data: z.object({
    projectId: z.number().int().positive(),
    fileId: z.number().int().positive(),
    displayName: z.string(),
    fileSize: z.number().int().nonnegative(),
    assetType: z.string().nullable(),
    signedUrl: z.string().url(),
    expiresAt: z.string(),
  }),
});

export async function getProjectReportFile(projectId: number, fileId: number) {
  const response = await fetchWithTimeout(getClientApiUrl(`/api/projects/${projectId}/report/files/${fileId}`), { credentials: "include" }, "프로젝트 상세 정보 파일을 여는 데 시간이 오래 걸리고 있습니다. 다시 시도해 주세요.");
  const payload = await readJson(response);
  if (!response.ok) throw getApiError(payload, response.status, "프로젝트 상세 정보 파일을 열지 못했습니다.");
  const parsed = schema.safeParse(payload);
  if (!parsed.success) throw new Error("프로젝트 상세 정보 파일 응답 형식이 올바르지 않습니다.");
  return parsed.data.data;
}

import { getApiError, readJson } from "@/shared/api/api-error";
import { getClientApiUrl } from "@/shared/api/client-api-url";
import { fetchWithTimeout } from "@/shared/api/fetch-with-timeout";
import { projectDetailResponseSchema } from "./project-detail-response-schema";

export async function getProjectViewer(projectId: number, signal?: AbortSignal) {
  const response = await fetchWithTimeout(getClientApiUrl(`/api/projects/${projectId}`), {
    credentials: "include",
    signal,
  }, "프로젝트 구매 권한 확인이 지연되고 있습니다. 다시 시도해 주세요.");
  const payload = await readJson(response);
  if (!response.ok) {
    throw getApiError(payload, response.status, "프로젝트 구매 권한을 확인하지 못했습니다.");
  }
  const parsed = projectDetailResponseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("프로젝트 구매 권한 응답 형식이 올바르지 않습니다.");
  }
  return parsed.data.data.viewer;
}

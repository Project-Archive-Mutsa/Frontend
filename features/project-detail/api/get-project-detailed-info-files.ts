import { getApiError, readJson } from "@/shared/api/api-error";
import { getClientApiUrl } from "@/shared/api/client-api-url";
import { fetchWithTimeout } from "@/shared/api/fetch-with-timeout";
import type { ProjectDetailedInfoFile } from "../model/types";
import { projectDetailResponseSchema } from "./project-detail-response-schema";

export async function getProjectDetailedInfoFiles(
  projectId: number,
  signal?: AbortSignal,
): Promise<readonly ProjectDetailedInfoFile[]> {
  const response = await fetchWithTimeout(
    getClientApiUrl(`/api/projects/${projectId}`),
    { credentials: "include", signal },
    "프로젝트 상세 정보의 자산 목록을 불러오는 데 시간이 오래 걸리고 있습니다. 다시 시도해 주세요.",
  );
  const payload = await readJson(response);

  if (!response.ok) {
    throw getApiError(
      payload,
      response.status,
      "프로젝트 상세 정보의 자산 목록을 불러오지 못했습니다.",
    );
  }

  const parsed = projectDetailResponseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("프로젝트 상세 정보 자산 응답 형식이 올바르지 않습니다.");
  }

  const project = parsed.data.data;
  const files = [
    ...project.detailPages.flatMap((page) =>
      page.files
        .filter((file) => file.canView)
        .map((file) => ({
          id: file.fileId,
          pageId: page.detailPageId,
          name: file.originalFileName,
          sizeInBytes: file.fileSize,
          assetType: file.assetType,
        })),
    ),
    ...project.files
      .filter((file) => file.canView)
      .map((file) => ({
        id: file.fileId,
        pageId: null,
        name: file.originalFileName,
        sizeInBytes: file.fileSize,
        assetType: file.assetType,
      })),
  ];

  return files.filter(
    (file, index) =>
      files.findIndex((candidate) => candidate.id === file.id) === index,
  );
}

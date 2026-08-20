import { cache } from "react";
import { getApiError, readJson } from "@/shared/api/api-error";
import { getServerApiUrl } from "@/shared/api/server-api-url";
import { normalizeProjectRegistrationPurpose } from "@/shared/project-summary/types";
import type { ProjectDetailViewModel, ProjectPurposeDetail } from "../model/types";
import { projectDetailResponseSchema, type RawProjectDetail } from "./project-detail-response-schema";

export class ProjectDetailNotFoundError extends Error {}

function normalizePurposeDetail(
  detail: RawProjectDetail["purposeDetail"],
): ProjectPurposeDetail {
  if (detail.purpose === "ARCHIVE" || detail.purpose === "ZOMBIE") {
    return { purpose: "ZOMBIE" };
  }
  return detail;
}

function mapDetail(raw: RawProjectDetail): ProjectDetailViewModel {
  const sellerName = raw.seller?.name ?? raw.seller?.loginId;
  const publicSummary = raw.publicSummary?.trim().slice(0, 100);

  return {
    id: raw.projectId,
    name: raw.projectName,
    summary: publicSummary || "프로젝트 공개 소개가 등록되지 않았습니다.",
    representativeImageUrl: raw.representativeImageUrl,
    galleryImageUrls: raw.galleryImageUrls,
    registrationPurpose: normalizeProjectRegistrationPurpose(
      raw.registrationPurpose,
    ),
    registeredAt: raw.registeredAt,
    event: raw.event,
    categories: raw.categories,
    problemAreas: raw.problemAreas,
    methods: raw.methods,
    tags: raw.tags,
    resultLevel: raw.resultLevel,
    activityStatus: raw.activityStatus,
    developmentPeriod: {
      startedAt: raw.projectPeriod?.startDate ?? raw.developmentPeriod?.startDate ?? null,
      endedAt: raw.projectPeriod?.endDate ?? raw.developmentPeriod?.endDate ?? null,
    },
    awards: raw.awards,
    team: raw.team,
    registrant: sellerName ? { id: raw.seller?.userId ?? null, name: sellerName } : null,
    stats: raw.stats,
    viewer: raw.viewer,
    informationCompletenessScore: raw.informationCompletenessScore,
    assetSummary: raw.assets,
    reportOffer: raw.reportOffer ?? {
      available: false,
      price: null,
      sectionCount: 0,
      sectionTitles: [],
    },
    purposeDetail: normalizePurposeDetail(raw.purposeDetail),
  };
}

export const getProjectDetail = cache(async (projectId: number): Promise<ProjectDetailViewModel> => {
  const response = await fetch(getServerApiUrl(`/api/projects/${projectId}`), { cache: "no-store" });
  const payload = await readJson(response);
  if (response.status === 404) throw new ProjectDetailNotFoundError("프로젝트를 찾을 수 없습니다.");
  if (!response.ok) throw getApiError(payload, response.status, "프로젝트 상세 정보를 불러오지 못했습니다.");
  const parsed = projectDetailResponseSchema.safeParse(payload);
  if (!parsed.success) throw new Error("프로젝트 상세 응답 형식이 올바르지 않습니다.");
  return mapDetail(parsed.data.data);
});

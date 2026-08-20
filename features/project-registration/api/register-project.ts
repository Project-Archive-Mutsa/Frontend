import { z } from "zod";
import type { ProjectAssetDraft, ProjectRegistrationDraft } from "@/features/project-registration/model/types";
import { getApiError, readJson } from "@/shared/api/api-error";
import { getClientApiUrl } from "@/shared/api/client-api-url";

const projectSchema = z.object({
  projectId: z.number().int().positive(),
  name: z.string().optional(),
  projectName: z.string().optional(),
  detailPath: z.string(),
  status: z.string(),
  commission: z.object({
    evaluationScore: z.number().int().min(0).max(100),
    grade: z.string(),
    feeRatePercent: z.number().nonnegative(),
    salePrice: z.number().int().nonnegative(),
    platformFee: z.number().int().nonnegative(),
    sellerSettlementAmount: z.number().int().nonnegative(),
    basis: z.string(),
  }).nullable().optional(),
  representativeImageSelected: z.boolean().optional(),
  resultLevel: z.string().nullable().optional(),
  activityStatus: z.string().nullable().optional(),
  assets: z.object({
    count: z.number().int().nonnegative(),
    categories: z.array(z.string()),
  }).optional(),
  informationCompletenessScore: z.number().int().min(0).max(100).nullable().optional(),
}).transform((project) => ({ ...project, projectName: project.projectName ?? project.name ?? "등록한 프로젝트" }));

const registrationEnvelopeSchema = z.object({
  success: z.literal(true),
  message: z.string().nullable().optional(),
  data: projectSchema,
});

const recruitmentEnvelopeSchema = z.object({
  success: z.literal(true),
  message: z.string().nullable().optional(),
  data: z.object({ id: z.number().int().positive() }).passthrough(),
});

const assetCategoryMap: Record<Exclude<ProjectAssetDraft["category"], "">, string> = {
  PLANNING_DOCUMENT: "PLANNING",
  DESIGN: "DESIGN",
  CODE_TECH: "CODE",
  DATA: "DATA",
  RESEARCH_VALIDATION: "RESEARCH",
  DEMO_MEDIA: "PRESENTATION",
  OFFLINE_OUTPUT: "OTHER",
  OTHER: "OTHER",
};

function getMonthPeriod(monthValue: string) {
  if (!/^\d{4}-\d{2}$/.test(monthValue)) {
    return { startedAt: null, endedAt: null };
  }
  const [year, month] = monthValue.split("-").map(Number);
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return {
    startedAt: `${monthValue}-01`,
    endedAt: `${monthValue}-${String(lastDay).padStart(2, "0")}`,
  };
}

function joinDetailFields(fields: ReadonlyArray<readonly [string, string]>) {
  return fields
    .filter(([, value]) => value.trim())
    .map(([label, value]) => `${label}\n${value.trim()}`)
    .join("\n\n");
}

function contentPages(draft: ProjectRegistrationDraft) {
  return [
    {
      pageName: "문제 상황과 대상",
      pageIntro: "문제가 발생한 맥락과 프로젝트가 대상으로 삼은 사용자·영역",
      pageContent: joinDetailFields([
        ["문제 상황", draft.problemDefinition],
        ["대상 사용자·영역", draft.targetAudience],
      ]),
      visibility: "PAID",
      sortOrder: 0,
    },
    {
      pageName: "해결 방법과 핵심 기능",
      pageIntro: "문제를 해결하기 위해 설계한 흐름과 핵심 작동 방식",
      pageContent: joinDetailFields([
        ["해결 방법", draft.solution],
        ["핵심 기능·수행 방식", draft.coreApproach],
      ]),
      visibility: "PAID",
      sortOrder: 1,
    },
    {
      pageName: "차별점과 검증",
      pageIntro: "기존 방식과 달랐던 선택과 이를 확인한 근거",
      pageContent: joinDetailFields([
        ["기존 방식과의 차이", draft.differentiation],
        ["검증 방법과 결과", draft.validation],
      ]),
      visibility: "PAID",
      sortOrder: 2,
    },
    {
      pageName: "제약·한계와 후속 과제",
      pageIntro: "수행 과정에서 확인된 조건과 추가로 검증해야 할 항목",
      pageContent: joinDetailFields([
        ["수행한 접근", draft.approaches],
        ["발생한 제약 조건", draft.constraints],
        ["확인된 한계", draft.limitations],
        [draft.activityStatus === "ENDED" ? "종료 사유" : "중단 사유", draft.endReason],
        ["후속 검증 과제", draft.nextValidationTasks],
      ]),
      visibility: "PAID",
      sortOrder: 3,
    },
  ];
}

function assetPage(draft: ProjectRegistrationDraft, asset: ProjectAssetDraft, index: number) {
  return {
    pageName: asset.title,
    pageIntro: asset.projectRole,
    pageContent: asset.description,
    visibility: "PAID",
    sortOrder: contentPages(draft).length + index,
  };
}

function createPayload(draft: ProjectRegistrationDraft, userId: number) {
  const projectIdentityText = [draft.projectName, draft.summary, draft.problemDefinition, draft.solution, draft.coreApproach].filter(Boolean).join("\n");
  const eventPeriod = getMonthPeriod(draft.eventDate);
  const common = {
    sellerUserId: userId,
    registrationPurpose: draft.purpose,
    projectName: draft.projectName,
    description: draft.summary,
    projectIdentityText,
    categories: draft.categories,
    developmentStatus: draft.activityStatus === "ACTIVE" ? "IN_PROGRESS" : draft.activityStatus === "ENDED" ? "COMPLETED" : "PAUSED",
    developmentStartDate: draft.projectStartedAt || null,
    developmentEndDate: draft.projectEndedAt || null,
    awardHistory: draft.awards.map((award) => `${award.title}${award.awardedAt ? ` (${award.awardedAt})` : ""}`).join(", "),
    resultLevel: draft.resultLevel,
    eventName: draft.eventName,
    eventType: draft.eventType,
    eventHostOrganization: draft.organizer,
    eventStartedAt: eventPeriod.startedAt,
    eventEndedAt: eventPeriod.endedAt,
    problemAreas: draft.problemAreas,
    methods: draft.methods,
    materialDisclosureConsent: draft.materialDisclosureConsent,
    assetCategories: [...new Set(draft.assets.flatMap((asset) => asset.category ? [assetCategoryMap[asset.category]] : []))],
    detailPages: [...contentPages(draft), ...draft.assets.map((asset, index) => assetPage(draft, asset, index))],
    links: draft.assets.flatMap((asset) => asset.sources.filter((source) => source.kind === "EXTERNAL_LINK").map((source) => ({
      linkType: source.provider,
      url: source.url,
      accessRequirement: draft.purpose === "ZOMBIE" ? "ENTITLEMENT" : "OWNER",
    }))),
  };
  if (draft.purpose === "SELL") return { ...common, priceType: draft.pricingMode, price: Number(draft.desiredPoints), bankName: "", accountNumber: "", fullTransferConfirmed: draft.materialDisclosureConsent };
  if (draft.purpose === "TEAM_RECRUIT") return { ...common, teamMemberCount: Number(draft.recruitmentHeadcount), teamRoles: draft.recruitmentRoles };
  return common;
}

async function parseProject(response: Response) {
  const payload = await readJson(response);
  if (!response.ok) throw getApiError(payload, response.status, "프로젝트 등록에 실패했습니다.");
  const parsed = registrationEnvelopeSchema.safeParse(payload);
  if (!parsed.success) throw new Error("프로젝트 등록 응답 형식이 올바르지 않습니다.");
  return parsed.data.data;
}

export async function createRecruitment(projectId: number, draft: ProjectRegistrationDraft, userId: number) {
  const response = await fetch(getClientApiUrl("/api/recruitments"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      projectId,
      ownerUserId: userId,
      title: draft.recruitmentTitle,
      description: draft.summary,
      roles: draft.recruitmentRoles,
      headcount: Number(draft.recruitmentHeadcount),
      deadline: draft.recruitmentDeadline,
      requiredSkills: draft.recruitmentSkills.split(",").map((skill) => skill.trim()).filter(Boolean),
      activitySchedule: draft.recruitmentSchedule || null,
      workMode: draft.recruitmentWorkMode || null,
      applicationGuide: draft.recruitmentApplicationNote || null,
      referenceAssetSummary: null,
    }),
  });
  const payload = await readJson(response);
  if (!response.ok) throw getApiError(payload, response.status, "팀원 모집글 등록에 실패했습니다.");
  const parsed = recruitmentEnvelopeSchema.safeParse(payload);
  if (!parsed.success) throw new Error("팀원 모집글 응답 형식이 올바르지 않습니다.");
  return parsed.data.data;
}

export async function registerProject({ draft, userId, representativeImage, assetFiles }: { draft: ProjectRegistrationDraft; userId: number; representativeImage: File | null; assetFiles: ReadonlyMap<string, File> }) {
  if (!draft.purpose) throw new Error("등록 목적을 선택해 주세요.");
  if (!draft.materialDisclosureConsent) throw new Error("등록한 모든 자료의 공개·제공 범위에 동의해 주세요.");

  const endpoint = draft.purpose === "ZOMBIE" ? "zombie" : draft.purpose === "SELL" ? "sale" : "team-recruit";
  const requestPart = draft.purpose === "SELL" ? "projectSaleRequest" : draft.purpose === "TEAM_RECRUIT" ? "teamRecruitRequest" : "projectRegisterRequest";
  const formData = new FormData();
  formData.append(requestPart, new Blob([JSON.stringify(createPayload(draft, userId))], { type: "application/json" }));
  if (representativeImage) formData.append("representativeImage", representativeImage);
  draft.assets.forEach((asset, index) => asset.sources.forEach((source) => {
    if (source.kind === "UPLOAD") {
      const file = assetFiles.get(source.id);
        if (file) formData.append(`detailPageFiles[${index + contentPages(draft).length}]`, file);
    }
  }));

  const response = await fetch(getClientApiUrl(`/api/project-registration/${endpoint}`), { method: "POST", credentials: "include", body: formData });
  const project = await parseProject(response);
  if (draft.purpose !== "TEAM_RECRUIT") return { project, recruitmentCreated: null as boolean | null, warning: null as string | null };
  try {
    await createRecruitment(project.projectId, draft, userId);
    return { project, recruitmentCreated: true, warning: null };
  } catch (error) {
    return { project, recruitmentCreated: false, warning: error instanceof Error ? `프로젝트는 등록됐지만 모집글 등록에 실패했습니다. ${error.message}` : "프로젝트는 등록됐지만 모집글 등록에 실패했습니다." };
  }
}

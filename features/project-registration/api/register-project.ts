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

function assetPage(asset: ProjectAssetDraft, index: number) {
  return {
    pageName: asset.title,
    pageIntro: asset.projectRole,
    pageContent: asset.description,
    sortOrder: index,
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
    activityStatus: draft.activityStatus,
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
    problemDefinition: draft.problemDefinition.trim(),
    targetAudience: draft.targetAudience.trim(),
    solution: draft.solution.trim(),
    coreFunctions: draft.coreApproach.trim() ? [draft.coreApproach.trim()] : [],
    differentiation: draft.differentiation.trim(),
    validationSummary: draft.validation.trim(),
    approaches: draft.approaches.trim(),
    constraints: draft.constraints.trim() || null,
    limitations: draft.limitations.trim(),
    terminationReason: draft.endReason.trim() || null,
    nextValidationTasks: draft.nextValidationTasks.trim(),
    materialDisclosureConsent: draft.materialDisclosureConsent,
    assetCategories: [...new Set(draft.assets.flatMap((asset) => asset.category ? [assetCategoryMap[asset.category]] : []))],
    detailPages: draft.assets.map(assetPage),
    links: draft.assets.flatMap((asset) => asset.sources.filter((source) => source.kind === "EXTERNAL_LINK").map((source) => ({
      linkType: source.provider,
      url: source.url,
    }))),
  };
  if (draft.purpose === "SELL") return { ...common, priceType: draft.pricingMode, price: Number(draft.desiredPoints) };
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
        if (file) formData.append(`detailPageFiles[${index}]`, file);
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

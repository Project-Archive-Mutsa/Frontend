import type {
  TeamRecruitment,
  TeamRecruitmentResponseItem,
} from "@/features/team-recruitment/types";

export function mapTeamRecruitment(
  recruitment: TeamRecruitmentResponseItem,
): TeamRecruitment {
  return {
    id: recruitment.id,
    title: recruitment.title,
    description: recruitment.description,
    roles: recruitment.roles,
    deadline: recruitment.deadline,
    projectId: recruitment.projectId ?? null,
    projectName: recruitment.projectName?.trim() || null,
    projectSummary: recruitment.projectSummary?.trim() || null,
    category: recruitment.category?.trim() || null,
    registeredDate: recruitment.registeredDate ?? null,
    representativeImage: recruitment.representativeImageUrl?.trim()
      ? {
          src: recruitment.representativeImageUrl,
          alt: `${recruitment.projectName || recruitment.title} 대표 이미지`,
        }
      : null,
    tags: recruitment.tags ?? [],
    eventName: recruitment.eventName?.trim() || null,
    eventDate: recruitment.eventDate ?? null,
    resultLevel: recruitment.resultLevel ?? null,
    activityStatus: recruitment.activityStatus ?? null,
    referenceAssetCount: recruitment.referenceAssetCount ?? null,
    referenceAssetCategories: recruitment.referenceAssetCategories ?? [],
    awardTitles:
      recruitment.awards === undefined
        ? null
        : recruitment.awards.map((award) => award.title).filter(Boolean),
    informationCompletenessScore:
      recruitment.informationCompletenessScore ?? null,
    skills: recruitment.skills?.trim() || null,
    headcount: recruitment.headcount ?? null,
    schedule: recruitment.schedule?.trim() || null,
    workMode: recruitment.workMode?.trim() || null,
  };
}

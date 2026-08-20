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
    status: recruitment.status,
    projectId: recruitment.projectId ?? null,
    projectName: recruitment.projectName?.trim() || null,
    projectSummary: recruitment.description,
    category: recruitment.categories[0]?.trim() || null,
    registeredDate: recruitment.createdAt.slice(0, 10),
    representativeImage: recruitment.representativeImageUrl?.trim()
      ? {
          src: recruitment.representativeImageUrl,
          alt: `${recruitment.projectName || recruitment.title} 대표 이미지`,
        }
      : null,
    tags: recruitment.categories,
    eventName: recruitment.event?.name?.trim() || null,
    eventDate: recruitment.event?.startedAt ?? null,
    resultLevel: recruitment.resultLevel ?? null,
    activityStatus: recruitment.activityStatus ?? null,
    referenceAssetCount: recruitment.assets.count,
    referenceAssetCategories: recruitment.assets.categories,
    awardTitles:
      recruitment.awards === undefined
        ? null
        : recruitment.awards.map((award) => award.title).filter(Boolean),
    informationCompletenessScore:
      recruitment.informationCompletenessScore ?? null,
    skills: recruitment.requiredSkills.join(", ") || null,
    headcount: recruitment.headcount ?? null,
    schedule: recruitment.activitySchedule?.trim() || null,
    workMode: recruitment.workMode?.trim() || null,
  };
}

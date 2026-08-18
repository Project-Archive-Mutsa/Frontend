import type {
  RecentAwardProject,
  RecentAwardProjectResponseItem,
} from "@/features/recent-award-projects/types";

export function mapRecentAwardProject(
  project: RecentAwardProjectResponseItem,
): RecentAwardProject {
  return {
    id: project.awardId,
    detailPath: project.detailPath,
    name: project.projectName,
    summary: project.description,
    representativeImage: project.representativeImageUrl?.trim()
      ? {
          src: project.representativeImageUrl,
          alt: `${project.projectName} 대표 이미지`,
        }
      : null,
    category: project.category,
    award: {
      competitionName: project.organization,
      title: project.awardRank,
      awardedAt: project.awardedDate,
    },
    stats: {
      viewCount: project.viewCount,
      likeCount: project.likeCount,
    },
    registrationPurpose: project.registrationPurpose ?? null,
    resultLevel: project.resultLevel ?? null,
    activityStatus: project.activityStatus ?? null,
    assetCount: project.assetCount ?? null,
    assetCategories: project.assetCategories ?? [],
    ...(project.informationCompletenessScore !== undefined
      ? {
          informationCompletenessScore:
            project.informationCompletenessScore,
        }
      : {}),
  };
}

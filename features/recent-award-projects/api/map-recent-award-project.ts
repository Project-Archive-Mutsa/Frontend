import type {
  RecentAwardProject,
  RecentAwardProjectResponseItem,
} from "@/features/recent-award-projects/types";

export function mapRecentAwardProject(
  project: RecentAwardProjectResponseItem,
): RecentAwardProject {
  return {
    id: project.awardId,
    projectId: project.projectId,
    detailPath: `/projects/${project.projectId}`,
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
    resultLevel: project.resultLevel,
    activityStatus: project.activityStatus,
    assetCount: project.assets.count,
    assetCategories: project.assets.categories,
    informationCompletenessScore: project.informationCompletenessScore,
  };
}

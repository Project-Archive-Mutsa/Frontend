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
    representativeImage: {
      src: project.representativeImageUrl,
      alt: `${project.projectName} 대표 이미지`,
    },
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
  };
}

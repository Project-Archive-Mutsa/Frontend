import type {
  PopularProject,
  PopularProjectResponseItem,
} from "@/features/popular-projects/types";

export function mapPopularProject(
  project: PopularProjectResponseItem,
): PopularProject {
  return {
    id: project.projectId,
    name: project.projectName,
    description: project.description,
    thumbnailUrl: project.representativeImageUrl,
    viewCount: project.viewCount,
    likeCount: project.likeCount,
    bookmarkCount: project.bookmarkCount,
    registeredDate: project.registeredDate,
    sellerName: project.sellerName,
    tags: project.tags,
    price: project.price,
    bookmarked: project.bookmarked,
    detailUrl: project.detailPath,
  };
}

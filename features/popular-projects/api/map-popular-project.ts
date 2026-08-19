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
    category: project.category,
    viewCount: project.viewCount,
    likeCount: project.likeCount,
    bookmarkCount: project.bookmarkCount,
    registeredDate: project.registeredDate,
    sellerName: project.sellerName,
    tags: project.tags,
    price: project.price,
    bookmarked: project.bookmarked,
    detailUrl: project.detailPath,
    registrationPurpose: project.registrationPurpose ?? null,
    eventName: project.eventName?.trim() || null,
    eventDate: project.eventDate ?? null,
    resultLevel: project.resultLevel ?? null,
    activityStatus: project.activityStatus ?? null,
    assetCount: project.assetCount ?? null,
    assetCategories: project.assetCategories ?? [],
    awardTitles:
      project.awards === undefined
        ? null
        : project.awards.map((award) => award.title).filter(Boolean),
    ...(project.informationCompletenessScore !== undefined
      ? {
          informationCompletenessScore:
            project.informationCompletenessScore,
        }
      : {}),
  };
}

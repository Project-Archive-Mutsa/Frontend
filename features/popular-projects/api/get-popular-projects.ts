import type { PopularProject } from "@/features/popular-projects/types";
import { getProjectList } from "@/shared/project-summary/api/get-project-list";

export async function getPopularProjects(): Promise<readonly PopularProject[]> {
  const page = await getProjectList({ sort: "POPULAR", size: 4 });
  return page.content.map((project) => ({
    id: project.id,
    name: project.name,
    description: project.summary,
    thumbnailUrl: project.representativeImageUrl,
    category: project.categories[0],
    viewCount: project.stats.viewCount,
    likeCount: project.stats.likeCount,
    bookmarkCount: project.stats.bookmarkCount,
    registeredDate: project.registeredAt,
    sellerName: undefined,
    tags: project.tags,
    price: project.price,
    bookmarked: project.bookmarked,
    detailUrl: `/projects/${project.id}`,
    informationCompletenessScore: project.informationCompletenessScore,
    registrationPurpose: project.registrationPurpose,
    eventName: project.event?.name,
    eventDate: project.event?.startedAt,
    resultLevel: project.resultLevel,
    activityStatus: project.activityStatus,
    assetCount: project.assets.count,
    assetCategories: project.assets.categories,
    awardTitles: project.awards.map((award) => award.title),
  }));
}

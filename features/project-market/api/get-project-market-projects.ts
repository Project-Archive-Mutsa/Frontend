import type { ProjectMarketProject } from "@/features/project-market/types";
import { getProjectList } from "@/shared/project-summary/api/get-project-list";

export async function getProjectMarketProjects(query: {
  query?: string;
  assetCategory?: string;
  category?: string;
  sort?: "RECENT" | "POPULAR";
} = {}): Promise<
  readonly ProjectMarketProject[]
> {
  return (await getProjectMarketPage({ ...query, size: 50 })).projects;
}

export async function getProjectMarketPage(query: {
  query?: string;
  assetCategory?: string;
  category?: string;
  sort?: "RECENT" | "POPULAR";
  page?: number;
  size?: number;
} = {}) {
  const result = await getProjectList({
    q: query.query,
    registrationPurpose: "SELL",
    assetCategory: query.assetCategory,
    category: query.category,
    sort: query.sort,
    page: query.page,
    size: query.size ?? 20,
  });

  const projects = result.content.map((project) => ({
    id: project.id,
    name: project.name,
    description: project.summary,
    category: project.categories[0],
    registeredAt: project.registeredAt,
    representativeImage: project.representativeImageUrl
      ? { src: project.representativeImageUrl, alt: `${project.name} 대표 이미지` }
      : null,
    tags: project.tags,
    stats: project.stats,
    sellerName: undefined,
    price: project.price,
    registrationPurpose: project.registrationPurpose,
    eventName: project.event?.name,
    eventDate: project.event?.startedAt,
    resultLevel: project.resultLevel,
    activityStatus: project.activityStatus,
    assetCount: project.assets.count,
    assetCategories: project.assets.categories,
    awardTitles: project.awards.map((award) => award.title),
    pricingMode: project.priceType,
    saleRightsSummary:
      project.transferScope === "FULL_PROJECT" ? "프로젝트 전체 양도" : project.transferScope,
    zipFile: null,
    informationCompletenessScore: project.informationCompletenessScore,
    bookmarked: project.bookmarked,
    transferScope: project.transferScope,
  }));
  return { projects, page: result.page, totalElements: result.totalElements, totalPages: result.totalPages };
}

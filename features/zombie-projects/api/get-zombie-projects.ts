import type { ZombieProject } from "@/features/zombie-projects/types";
import { getProjectList } from "@/shared/project-summary/api/get-project-list";
import type { ProjectActivityStatus, ProjectResultLevel } from "@/shared/project-summary/types";

export async function getZombieProjects(query: { query?: string; category?: string; assetCategory?: string; resultLevel?: string; activityStatus?: string; eventType?: string; sort?: "RECENT" | "POPULAR" } = {}): Promise<
  readonly ZombieProject[]
> {
  return (await getZombieProjectPage({ ...query, size: 50 })).projects;
}

export async function getZombieProjectPage(query: { query?: string; category?: string; assetCategory?: string; resultLevel?: string; activityStatus?: string; eventType?: string; sort?: "RECENT" | "POPULAR"; page?: number; size?: number } = {}) {
  const resultLevel = ["IDEA_PLAN", "DESIGNED", "INITIAL_OUTPUT", "SUBMISSION_OUTPUT", "APPLIED"].includes(query.resultLevel ?? "")
    ? (query.resultLevel as ProjectResultLevel)
    : undefined;
  const activityStatus = ["ACTIVE", "PAUSED", "ENDED"].includes(query.activityStatus ?? "")
    ? (query.activityStatus as ProjectActivityStatus)
    : undefined;
  const result = await getProjectList({ q: query.query, registrationPurpose: "ZOMBIE", category: query.category, assetCategory: query.assetCategory, resultLevel, activityStatus, eventType: query.eventType, sort: query.sort, page: query.page, size: query.size ?? 20 });
  const projects = result.content.map((project) => ({
    id: project.id,
    detailPath: `/projects/${project.id}`,
    name: project.name,
    description: project.summary,
    registeredAt: project.registeredAt,
    representativeImage: project.representativeImageUrl ? { src: project.representativeImageUrl, alt: `${project.name} 대표 이미지` } : null,
    tags: project.tags,
    stats: project.stats,
    sellerName: undefined,
    price: 0,
    zipFile: null,
    informationCompletenessScore: project.informationCompletenessScore,
    category: project.categories[0] ?? null,
    registrationPurpose: project.registrationPurpose,
    eventName: project.event?.name ?? null,
    eventDate: project.event?.startedAt ?? null,
    resultLevel: project.resultLevel,
    activityStatus: project.activityStatus,
    assetCount: project.assets.count,
    assetCategories: project.assets.categories,
    awardTitles: project.awards.map((award) => award.title),
    bookmarked: project.bookmarked,
  }));
  return { projects, page: result.page, totalElements: result.totalElements, totalPages: result.totalPages };
}

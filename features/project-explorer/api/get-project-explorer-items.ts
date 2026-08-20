import type { ArchiveProjectItem } from "@/features/project-explorer/model/types";
import type { ProjectExplorerSearchState } from "@/features/project-explorer/model/types";
import { getProjectList } from "@/shared/project-summary/api/get-project-list";

export async function getProjectExplorerItems(
  state: ProjectExplorerSearchState,
): Promise<{ projects: readonly ArchiveProjectItem[]; totalElements: number; totalPages: number }> {
  const page = await getProjectList({
    q: state.query,
    eventType: state.eventType,
    eventYear: state.eventYear,
    category: state.category,
    resultLevel: state.resultLevel || undefined,
    activityStatus: state.activityStatus || undefined,
    sort: state.sort,
    page: state.page,
    size: 20,
  });

  return {
    totalElements: page.totalElements,
    totalPages: page.totalPages,
    projects: page.content.map((project) => ({
      kind: "archive",
      id: project.id,
      name: project.name,
      description: project.summary,
      category: project.categories[0] ?? "미분류",
      registeredAt: project.registeredAt,
      representativeImage: project.representativeImageUrl
        ? { src: project.representativeImageUrl, alt: `${project.name} 대표 이미지` }
        : null,
      tags: project.tags,
      stats: project.stats,
      registrantName: undefined,
      registrationPurpose: project.registrationPurpose,
      eventName: project.event?.name ?? null,
      eventDate: project.event?.startedAt ?? null,
      resultLevel: project.resultLevel,
      activityStatus: project.activityStatus,
      assetCount: project.assets.count,
      assetCategories: project.assets.categories,
      awardTitles: project.awards.map((award) => award.title),
      detailAccess: "PUBLIC_SUMMARY",
      informationCompletenessScore: project.informationCompletenessScore,
      bookmarked: project.bookmarked,
    })),
  };
}

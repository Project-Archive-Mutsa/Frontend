import type { z } from "zod";
import type { ArchiveProjectItem } from "@/features/project-explorer/model/types";
import { normalizeProjectRegistrationPurpose } from "@/shared/project-summary/types";
import { projectExplorerResponseItemSchema } from "./project-explorer-response-schema";

type ProjectExplorerResponseItem = z.infer<
  typeof projectExplorerResponseItemSchema
>;

function getRepresentativeImageUrl(
  project: ProjectExplorerResponseItem,
): string | null {
  const directImageUrl = project.representativeImageUrl?.trim();

  if (directImageUrl) {
    return directImageUrl;
  }

  const fallbackImage = [...project.images]
    .sort((left, right) => left.displayOrder - right.displayOrder)
    .find((image) => image.representative && image.imageUrl.trim());

  return fallbackImage?.imageUrl.trim() || null;
}

export function mapArchiveProject(
  project: ProjectExplorerResponseItem,
): ArchiveProjectItem {
  const representativeImageUrl = getRepresentativeImageUrl(project);

  return {
    kind: "archive",
    id: project.projectId,
    name: project.projectName,
    description: project.description.trim().slice(0, 100),
    category: project.category,
    registeredAt: project.registeredDate,
    representativeImage: representativeImageUrl
      ? {
          src: representativeImageUrl,
          alt: `${project.projectName} 대표 이미지`,
        }
      : null,
    tags: project.tags,
    stats: {
      viewCount: project.viewCount,
      likeCount: project.likeCount,
      bookmarkCount: project.bookmarkCount,
    },
    registrantName: project.sellerName,
    registrationPurpose: project.registrationPurpose
      ? normalizeProjectRegistrationPurpose(project.registrationPurpose)
      : null,
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
    detailAccess: "SUBSCRIBER_REPORT",
    informationCompletenessScore:
      project.informationCompletenessScore ?? null,
    bookmarked: false,
  };
}

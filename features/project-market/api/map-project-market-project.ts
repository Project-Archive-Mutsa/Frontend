import type {
  ProjectMarketProject,
  ProjectMarketProjectResponseItem,
} from "@/features/project-market/types";
import { normalizeProjectRegistrationPurpose } from "@/shared/project-summary/types";

function getRepresentativeImageUrl(
  project: ProjectMarketProjectResponseItem,
): string | null {
  const representativeImageUrl = project.representativeImageUrl?.trim();

  if (representativeImageUrl) {
    return representativeImageUrl;
  }

  const fallbackImage = [...project.images]
    .sort((left, right) => left.displayOrder - right.displayOrder)
    .find((image) => image.representative && image.imageUrl.trim());

  return fallbackImage?.imageUrl.trim() || null;
}

export function mapProjectMarketProject(
  project: ProjectMarketProjectResponseItem,
): ProjectMarketProject {
  const representativeImageUrl = getRepresentativeImageUrl(project);

  return {
    id: project.projectId,
    name: project.projectName,
    description: project.description.trim().slice(0, 100),
    category: project.category?.trim() || undefined,
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
    sellerName: project.sellerName,
    price: project.price,
    registrationPurpose: project.registrationPurpose
      ? normalizeProjectRegistrationPurpose(project.registrationPurpose)
      : "SELL",
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
    pricingMode: project.pricingMode ?? null,
    saleRightsSummary: project.saleRightsSummary?.trim() || null,
    zipFile: project.zipFile
      ? {
          name: project.zipFile.originalFileName,
          sizeInBytes: project.zipFile.fileSize,
        }
      : null,
    ...(project.informationCompletenessScore !== undefined
      ? {
          informationCompletenessScore:
            project.informationCompletenessScore,
        }
      : {}),
    bookmarked: project.bookmarked,
    transferScope: project.transferScope ?? null,
  };
}

import type {
  ZombieProject,
  ZombieProjectResponseItem,
} from "@/features/zombie-projects/types";

export function mapZombieProject(
  project: ZombieProjectResponseItem,
): ZombieProject {
  const representativeImageUrl = project.representativeImageUrl?.trim();

  return {
    id: project.projectId,
    detailPath: project.detailPath,
    name: project.projectName,
    description: project.description,
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
    zipFile: project.zipFile
      ? {
          name: project.zipFile.originalFileName,
          sizeInBytes: project.zipFile.fileSize,
        }
      : null,
    category: project.category?.trim() || null,
    registrationPurpose: project.registrationPurpose ?? "ZOMBIE",
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
    publicAssets: project.publicAssets ?? null,
    ...(project.informationCompletenessScore !== undefined
      ? {
          informationCompletenessScore:
            project.informationCompletenessScore,
        }
      : {}),
  };
}

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
  };
}

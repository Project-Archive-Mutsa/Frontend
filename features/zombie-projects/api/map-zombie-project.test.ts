import { describe, expect, it } from "vitest";
import type { ZombieProjectResponseItem } from "@/features/zombie-projects/types";
import { mapZombieProject } from "./map-zombie-project";

function createResponseItem(
  overrides: Partial<ZombieProjectResponseItem> = {},
): ZombieProjectResponseItem {
  return {
    projectId: 1,
    projectName: "이어갈 프로젝트",
    description: "중단된 프로젝트 설명",
    registeredDate: "2026-08-18",
    representativeImageUrl: "https://example.com/project.png",
    tags: ["Next.js", "AI"],
    viewCount: 1200,
    likeCount: 340,
    bookmarkCount: 56,
    sellerName: "아카이브 팀",
    price: 250000,
    zipFile: {
      originalFileName: "archive.zip",
      fileSize: 1048576,
      downloadUrl: "https://example.com/archive.zip",
    },
    detailPath: "/projects/1",
    ...overrides,
  };
}

describe("mapZombieProject", () => {
  it("API 응답을 좀비 프로젝트 화면 모델로 변환하고 다운로드 URL을 제외한다", () => {
    const result = mapZombieProject(createResponseItem());

    expect(result).toEqual({
      id: 1,
      detailPath: "/projects/1",
      name: "이어갈 프로젝트",
      description: "중단된 프로젝트 설명",
      registeredAt: "2026-08-18",
      representativeImage: {
        src: "https://example.com/project.png",
        alt: "이어갈 프로젝트 대표 이미지",
      },
      tags: ["Next.js", "AI"],
      stats: {
        viewCount: 1200,
        likeCount: 340,
        bookmarkCount: 56,
      },
      sellerName: "아카이브 팀",
      price: 250000,
      zipFile: {
        name: "archive.zip",
        sizeInBytes: 1048576,
      },
    });
    expect(JSON.stringify(result)).not.toContain("downloadUrl");
    expect(JSON.stringify(result)).not.toContain(
      "https://example.com/archive.zip",
    );
  });

  it("대표 이미지와 ZIP 파일이 없으면 null로 유지한다", () => {
    const result = mapZombieProject(
      createResponseItem({ representativeImageUrl: " ", zipFile: null }),
    );

    expect(result.representativeImage).toBeNull();
    expect(result.zipFile).toBeNull();
  });
});

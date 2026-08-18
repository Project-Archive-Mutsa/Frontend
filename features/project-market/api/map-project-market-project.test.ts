import { describe, expect, it } from "vitest";
import type { ProjectMarketProjectResponseItem } from "@/features/project-market/types";
import { mapProjectMarketProject } from "./map-project-market-project";

function createResponseItem(
  overrides: Partial<ProjectMarketProjectResponseItem> = {},
): ProjectMarketProjectResponseItem {
  return {
    projectId: 1,
    projectName: "이어갈 프로젝트",
    description: "프로젝트 설명",
    category: "PROJECT",
    registeredDate: "2026-08-18",
    representativeImageUrl: "https://example.com/representative.svg",
    images: [],
    tags: ["Next.js", "AI"],
    viewCount: 1200,
    likeCount: 340,
    bookmarkCount: 56,
    sellerName: "아카이브 팀",
    price: 250000,
    bookmarked: true,
    zipFile: {
      originalFileName: "archive.zip",
      fileSize: 1048576,
      downloadUrl: "https://example.com/archive.zip",
    },
    detailPath: "/projects/1",
    ...overrides,
  };
}

describe("mapProjectMarketProject", () => {
  it("API 응답을 마켓 화면 모델로 변환하고 동작 전용 필드를 제외한다", () => {
    const result = mapProjectMarketProject(createResponseItem());

    expect(result).toEqual({
      id: 1,
      name: "이어갈 프로젝트",
      description: "프로젝트 설명",
      registeredAt: "2026-08-18",
      representativeImage: {
        src: "https://example.com/representative.svg",
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
    expect(JSON.stringify(result)).not.toContain("detailPath");
    expect(JSON.stringify(result)).not.toContain("bookmarked");
  });

  it("대표 이미지 URL이 비어 있으면 images의 대표 이미지를 사용한다", () => {
    const result = mapProjectMarketProject(
      createResponseItem({
        representativeImageUrl: " ",
        images: [
          {
            imageId: 2,
            imageUrl: "https://example.com/second.svg",
            originalFileName: "second.svg",
            displayOrder: 2,
            representative: true,
          },
          {
            imageId: 1,
            imageUrl: "https://example.com/first.svg",
            originalFileName: "first.svg",
            displayOrder: 1,
            representative: true,
          },
        ],
      }),
    );

    expect(result.representativeImage?.src).toBe(
      "https://example.com/first.svg",
    );
  });

  it("대표 이미지와 ZIP 파일이 없으면 null로 유지한다", () => {
    const result = mapProjectMarketProject(
      createResponseItem({
        representativeImageUrl: null,
        images: [],
        zipFile: null,
      }),
    );

    expect(result.representativeImage).toBeNull();
    expect(result.zipFile).toBeNull();
  });
});

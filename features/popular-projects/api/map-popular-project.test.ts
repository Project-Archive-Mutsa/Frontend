import { describe, expect, it } from "vitest";
import { mapPopularProject } from "./map-popular-project";

describe("mapPopularProject", () => {
  it("API 응답을 인기 프로젝트 화면 모델로 변환한다", () => {
    const result = mapPopularProject({
      projectId: 1,
      projectName: "테스트 프로젝트",
      description: "테스트 설명",
      category: "PROJECT",
      registeredDate: "2026-09-01",
      representativeImageUrl: "https://example.com/project.svg",
      tags: ["AI", "해커톤"],
      viewCount: 100,
      likeCount: 20,
      bookmarkCount: 10,
      sellerName: "테스트 판매자",
      price: 53000,
      bookmarked: false,
      zipFile: null,
      detailPath: "/projects/1",
    });

    expect(result).toEqual({
      id: 1,
      name: "테스트 프로젝트",
      description: "테스트 설명",
      thumbnailUrl: "https://example.com/project.svg",
      viewCount: 100,
      likeCount: 20,
      bookmarkCount: 10,
      registeredDate: "2026-09-01",
      sellerName: "테스트 판매자",
      tags: ["AI", "해커톤"],
      price: 53000,
      bookmarked: false,
      detailUrl: "/projects/1",
    });
  });
});

import { describe, expect, it } from "vitest";
import { mapRecentAwardProject } from "./map-recent-award-project";

describe("mapRecentAwardProject", () => {
  it("API 응답을 최근 수상작 화면 모델로 변환한다", () => {
    const result = mapRecentAwardProject({
      awardId: 1,
      projectName: "테스트 프로젝트",
      category: "해커톤",
      description: "테스트 설명",
      organization: "테스트 해커톤",
      awardRank: "대상",
      representativeImageUrl: "https://example.com/award.svg",
      awardedDate: "2026-08-12",
      viewCount: 100,
      likeCount: 20,
      detailPath: "/awards/1",
    });

    expect(result).toEqual({
      id: 1,
      detailPath: "/awards/1",
      name: "테스트 프로젝트",
      summary: "테스트 설명",
      representativeImage: {
        src: "https://example.com/award.svg",
        alt: "테스트 프로젝트 대표 이미지",
      },
      category: "해커톤",
      award: {
        competitionName: "테스트 해커톤",
        title: "대상",
        awardedAt: "2026-08-12",
      },
      stats: {
        viewCount: 100,
        likeCount: 20,
      },
    });
  });
});

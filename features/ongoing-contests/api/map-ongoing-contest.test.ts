import { describe, expect, it } from "vitest";
import { mapOngoingContest } from "./map-ongoing-contest";

describe("mapOngoingContest", () => {
  it("API 응답을 진행 중인 공모전 화면 모델로 변환한다", () => {
    const result = mapOngoingContest({
      contestId: 1,
      contestName: "테스트 공모전",
      description: "테스트 설명",
      representativeImageUrl: "https://example.com/contest.svg",
      images: [],
      startDate: "2026-08-20",
      endDate: "2026-09-30",
      status: "ACTIVE",
      applyUrl: "https://example.com/contest",
      detailPath: "/contests/1",
    });

    expect(result).toEqual({
      id: 1,
      title: "테스트 공모전",
      description: "테스트 설명",
      imageUrl: "https://example.com/contest.svg",
      startDate: "2026-08-20",
      endDate: "2026-09-30",
      applyUrl: "https://example.com/contest",
      detailUrl: "/contests/1",
    });
  });
});

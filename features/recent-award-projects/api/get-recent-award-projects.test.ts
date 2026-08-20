import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const API_BASE_URL = "https://api.example.com";

describe("최근 수상작 API", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.stubEnv("API_BASE_URL", API_BASE_URL);
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("최신 수상작 계약을 검증하고 프로젝트 상세 경로로 변환한다", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({
        success: true,
        data: [
          {
            awardId: 3,
            projectId: 41,
            projectName: "수상 프로젝트",
            category: "해커톤",
            description: "운영 문제를 해결한 프로젝트",
            organization: "테스트 해커톤",
            awardRank: "대상",
            representativeImageUrl: null,
            images: [],
            representativeImageSelected: false,
            resultLevel: "SUBMISSION_OUTPUT",
            activityStatus: "ENDED",
            assets: { count: 2, categories: ["DOCUMENT", "CODE_TECH"] },
            informationCompletenessScore: 78,
            awardedDate: "2026-08-20",
            viewCount: 10,
            likeCount: 4,
            detailPath: "/awards/3",
          },
        ],
        message: "최근 수상작 목록을 조회했습니다.",
      }),
    } as unknown as Response);

    const { getRecentAwardProjects } = await import(
      "./get-recent-award-projects"
    );

    await expect(getRecentAwardProjects()).resolves.toEqual([
      expect.objectContaining({
        id: 3,
        projectId: 41,
        detailPath: "/projects/41",
        assetCount: 2,
        assetCategories: ["DOCUMENT", "CODE_TECH"],
      }),
    ]);
  });

  it("계약에 없는 응답은 화면 데이터로 사용하지 않는다", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({
        success: true,
        data: [{ awardId: 3, projectName: "projectId 누락" }],
      }),
    } as unknown as Response);

    const { getRecentAwardProjects } = await import(
      "./get-recent-award-projects"
    );

    await expect(getRecentAwardProjects()).rejects.toThrow(
      "최근 수상작 응답 형식이 올바르지 않습니다.",
    );
  });
});

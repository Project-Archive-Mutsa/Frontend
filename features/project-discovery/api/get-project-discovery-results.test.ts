import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const API_BASE_URL = "https://api.example.com";
const QUERY = "AI 광고 관리 서비스";

const getProjectDetailMock = vi.hoisted(() => vi.fn());

vi.mock("@/features/project-detail/api/get-project-detail", () => ({
  getProjectDetail: getProjectDetailMock,
}));

const analysisSummary = {
  summary:
    "광고 성과를 분석하고 운영 판단을 돕는 프로젝트를 중심으로 비교했습니다.",
  keywords: ["AI", "광고", "데이터 분석"],
  comparisonPoints: ["성과 지표와 추천 방식의 차이를 비교해 보세요."],
  validationPoints: ["실제 광고 데이터 확보 가능성을 확인해 보세요."],
  interpretationNote:
    "유사도는 아이디어의 우수성이나 성공 가능성을 보장하지 않습니다.",
};

const project = {
  projectId: 17,
  projectName: "광고 성과 분석기",
  description: "광고 채널별 성과를 분석하는 프로젝트입니다.",
  category: "AI·데이터",
  registeredDate: "2026-08-10",
  representativeImageUrl: null,
  images: [],
  tags: ["광고", "분석"],
  viewCount: 12,
  likeCount: 3,
  bookmarkCount: 2,
  sellerName: "아카이버",
  price: 0,
  detailPath: "/api/projects/17",
  similarityScore: 0.913,
  similarReason: "광고 성과 분석이라는 문제와 해결 방식이 가깝습니다.",
  differencePoint: null,
  validationSuggestion: "추천 결과의 설명 가능성을 검증해 보세요.",
};

const successResponse = {
  success: true,
  data: {
    query: QUERY,
    matchedCategories: ["AI·인공지능", "마케팅·광고"],
    analysisSummary,
    analysisStatus: "SUCCEEDED",
    projects: [project],
    contests: [
      {
        contestId: 3,
        contestName: "AI 서비스 공모전",
        description: "AI 서비스 아이디어를 모집합니다.",
        searchCategories: ["AI·인공지능"],
        representativeImageUrl: null,
        images: [],
        detailPath: "/api/contests/3",
        similarityScore: 0.72,
      },
    ],
    ideas: [
      {
        ideaId: 4,
        ideaName: "광고 문구 추천",
        description: "성과 기반 광고 문구 추천 아이디어",
        searchCategories: ["마케팅·광고"],
        tags: ["생성형 AI"],
        detailPath: "/api/ideas/4",
        similarityScore: 0.69,
      },
    ],
    awards: [
      {
        awardId: 5,
        projectName: "캠페인 옵티마이저",
        description: "광고 캠페인을 최적화합니다.",
        category: "마케팅·광고",
        representativeImageUrl: null,
        images: [],
        tags: ["광고"],
        detailPath: "/api/awards/5",
        similarityScore: 0.66,
        awardRank: "우수상",
        awardedDate: "2026-07-01",
      },
    ],
  },
  message: "AI 프로젝트 검색 결과를 조회했습니다.",
};

function createResponse({
  ok,
  status,
  body,
}: {
  ok: boolean;
  status: number;
  body: unknown;
}) {
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response;
}

describe("AI 프로젝트 검색 결과 API", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("API_BASE_URL", API_BASE_URL);
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
    getProjectDetailMock.mockReset();
    getProjectDetailMock.mockRejectedValue(
      new Error("프로젝트 상세 정보를 불러오지 못했습니다."),
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("#38 분석 결과와 프로젝트별 비교 문구를 화면 모델로 변환한다", async () => {
    fetchMock.mockResolvedValue(
      createResponse({ ok: true, status: 200, body: successResponse }),
    );
    const { getProjectDiscoveryResults } = await import(
      "./get-project-discovery-results"
    );

    const result = await getProjectDiscoveryResults(QUERY);

    expect(result.analysis).toEqual(analysisSummary);
    expect(result.analysisStatus).toBe("SUCCEEDED");
    expect(result.projects[0]).toMatchObject({
      type: "PROJECT",
      id: 17,
      title: "광고 성과 분석기",
      detailPath: "/projects/17",
      similarityScore: 0.913,
      similarityReasons: [
        "광고 성과 분석이라는 문제와 해결 방식이 가깝습니다.",
      ],
      differences: [],
      validationSuggestions: [
        "추천 결과의 설명 가능성을 검증해 보세요.",
      ],
      metadataStatus: "PARTIAL",
    });
    expect(result.contests).toHaveLength(1);
    expect(result.ideas).toHaveLength(1);
    expect(result.awards[0]?.awards).toEqual([
      { title: "우수상", awardedAt: "2026-07-01" },
    ]);
    expect(getProjectDetailMock).toHaveBeenCalledWith(17);
  });

  it("프로젝트 상세 응답이 있으면 공통 메타데이터를 실제 값으로 보강한다", async () => {
    fetchMock.mockResolvedValue(
      createResponse({ ok: true, status: 200, body: successResponse }),
    );
    getProjectDetailMock.mockResolvedValue({
      name: "광고 성과 분석기",
      summary: "광고 데이터를 분석해 운영 판단을 돕습니다.",
      categories: ["데이터 분석"],
      tags: ["AI", "광고"],
      representativeImageUrl: null,
      informationCompletenessScore: 86,
      registrationPurpose: "ZOMBIE",
      event: { name: "AI 해커톤", startedAt: "2026-07-10" },
      resultLevel: "SUBMISSION_OUTPUT",
      activityStatus: "ENDED",
      assetSummary: {
        publicCount: 2,
        paidCount: 3,
        categories: ["기획 문서", "소스 코드"],
      },
      awards: [{ title: "우수상", awardedAt: "2026-07-10" }],
    });
    const { getProjectDiscoveryResults } = await import(
      "./get-project-discovery-results"
    );

    const result = await getProjectDiscoveryResults(QUERY);

    expect(result.projects[0]).toMatchObject({
      description: "광고 데이터를 분석해 운영 판단을 돕습니다.",
      category: "데이터 분석",
      informationCompletenessScore: 86,
      registrationPurpose: "ZOMBIE",
      eventName: "AI 해커톤",
      resultLevel: "SUBMISSION_OUTPUT",
      activityStatus: "ENDED",
      assetCount: 5,
      metadataStatus: "FULL",
    });
  });

  it("AI 분석이 실패해도 null 요약과 검색 후보를 유지한다", async () => {
    fetchMock.mockResolvedValue(
      createResponse({
        ok: true,
        status: 200,
        body: {
          ...successResponse,
          data: {
            ...successResponse.data,
            analysisSummary: null,
            analysisStatus: "FAILED",
          },
        },
      }),
    );
    const { getProjectDiscoveryResults } = await import(
      "./get-project-discovery-results"
    );

    const result = await getProjectDiscoveryResults(QUERY);

    expect(result.analysis).toBeNull();
    expect(result.analysisStatus).toBe("FAILED");
    expect(result.projects).toHaveLength(1);
  });

  it("검색어를 쿼리 파라미터로 전달하고 캐시하지 않는다", async () => {
    fetchMock.mockResolvedValue(
      createResponse({
        ok: true,
        status: 200,
        body: {
          ...successResponse,
          data: { ...successResponse.data, projects: [] },
        },
      }),
    );
    const { getProjectDiscoveryResults } = await import(
      "./get-project-discovery-results"
    );

    await getProjectDiscoveryResults(QUERY);

    const expectedUrl = new URL(
      "/api/ai/project-discovery/results",
      API_BASE_URL,
    );
    expectedUrl.searchParams.set("query", QUERY);
    expect(fetchMock).toHaveBeenCalledWith(expectedUrl, { cache: "no-store" });
  });

  it("HTTP 오류에는 상태 코드를 포함한 오류를 반환한다", async () => {
    fetchMock.mockResolvedValue(
      createResponse({ ok: false, status: 500, body: successResponse }),
    );
    const { getProjectDiscoveryResults } = await import(
      "./get-project-discovery-results"
    );

    await expect(getProjectDiscoveryResults(QUERY)).rejects.toThrow(
      "AI 검색 결과 조회에 실패했습니다. (500)",
    );
  });

  it("성공 응답의 데이터 형식이 잘못되면 오류를 반환한다", async () => {
    fetchMock.mockResolvedValue(
      createResponse({
        ok: true,
        status: 200,
        body: {
          success: true,
          data: { query: QUERY },
          message: "검색 결과를 조회하지 못했습니다.",
        },
      }),
    );
    const { getProjectDiscoveryResults } = await import(
      "./get-project-discovery-results"
    );

    await expect(getProjectDiscoveryResults(QUERY)).rejects.toThrow(
      "AI 검색 결과 응답 형식이 올바르지 않습니다.",
    );
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const API_BASE_URL = "https://api.example.com";
const QUERY = "service analyzer";

const successResponse = {
  success: true,
  data: {
    query: QUERY,
    totalCount: 1,
    projects: [
      {
        projectTitle: "service-analyzer",
        totalFiles: 86,
        selectedFiles: [
          {
            path: "README.md",
            extension: "md",
            kind: "TEXT",
            size: 12048,
          },
        ],
        functionalSummary: ["서비스 구조를 분석합니다."],
        differentiators: ["문서 중심 분석"],
        technicalStrengths: ["정적 분석"],
        futureDirections: ["지원 언어 확장"],
        sections: [{ title: "핵심 차별화 요소", items: ["빠른 분석"] }],
      },
    ],
  },
  message: "검색 결과를 조회했습니다.",
};

const catalogSuccessResponse = {
  success: true,
  data: {
    query: "접근성",
    totalCount: 1,
    projects: [
      {
        projectId: 1060,
        projectName: "날씨 반응형 접근성 예술 전시",
        description: "대체 텍스트와 음성 해설을 제작합니다.",
        registeredDate: "2026-03-25",
        representativeImageUrl: null,
        tags: ["접근성", "전시"],
        viewCount: 14301,
        likeCount: 91,
        bookmarkCount: 17,
        sellerName: "Project Archive Demo",
        price: 41000,
        zipFile: {
          originalFileName: "accessible-art-exhibit.zip",
          fileSize: 865613,
          downloadUrl: "https://example.com/accessible-art-exhibit.zip",
        },
        detailPath: "/projects/1060",
        category: "PROJECT",
        bookmarked: false,
      },
    ],
  },
  message: "검색 결과를 조회했습니다.",
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

describe("중단 프로젝트 검색 API", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("API_BASE_URL", API_BASE_URL);
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("검색어를 q로 전달하고 캐시 없이 호출한다", async () => {
    fetchMock.mockResolvedValue(
      createResponse({ ok: true, status: 200, body: successResponse }),
    );
    const { getZombieProjectSearchResults } = await import(
      "./get-zombie-project-search-results"
    );

    await expect(getZombieProjectSearchResults(QUERY)).resolves.toEqual({
      query: QUERY,
      totalCount: 1,
      projects: [
        {
          kind: "analysis",
          project: successResponse.data.projects[0],
        },
      ],
    });
    const expectedUrl = new URL("/api/projects/search", API_BASE_URL);
    expectedUrl.searchParams.set("q", QUERY);
    expect(fetchMock).toHaveBeenCalledWith(expectedUrl.toString(), {
      cache: "no-store",
    });
  });

  it("운영 API의 목록형 프로젝트 응답을 화면 모델로 변환한다", async () => {
    fetchMock.mockResolvedValue(
      createResponse({
        ok: true,
        status: 200,
        body: catalogSuccessResponse,
      }),
    );
    const { getZombieProjectSearchResults } = await import(
      "./get-zombie-project-search-results"
    );

    const result = await getZombieProjectSearchResults("접근성");

    expect(result.projects).toEqual([
      {
        kind: "catalog",
        project: {
          id: 1060,
          detailPath: "/projects/1060",
          name: "날씨 반응형 접근성 예술 전시",
          description: "대체 텍스트와 음성 해설을 제작합니다.",
          registeredAt: "2026-03-25",
          representativeImage: null,
          tags: ["접근성", "전시"],
          stats: {
            viewCount: 14301,
            likeCount: 91,
            bookmarkCount: 17,
          },
          sellerName: "Project Archive Demo",
          price: 41000,
          zipFile: {
            name: "accessible-art-exhibit.zip",
            sizeInBytes: 865613,
          },
        },
      },
    ]);
  });

  it("HTTP 오류에 상태 코드를 포함한다", async () => {
    fetchMock.mockResolvedValue(
      createResponse({ ok: false, status: 400, body: null }),
    );
    const { getZombieProjectSearchResults } = await import(
      "./get-zombie-project-search-results"
    );

    await expect(getZombieProjectSearchResults(QUERY)).rejects.toThrow(
      "중단 프로젝트 검색에 실패했습니다. (400)",
    );
  });

  it("실패 응답의 서버 메시지를 오류로 반환한다", async () => {
    fetchMock.mockResolvedValue(
      createResponse({
        ok: true,
        status: 200,
        body: {
          success: false,
          data: null,
          message: "검색어가 올바르지 않습니다.",
        },
      }),
    );
    const { getZombieProjectSearchResults } = await import(
      "./get-zombie-project-search-results"
    );

    await expect(getZombieProjectSearchResults(QUERY)).rejects.toThrow(
      "검색어가 올바르지 않습니다.",
    );
  });

  it("성공 응답의 프로젝트 구조가 잘못되면 오류를 반환한다", async () => {
    fetchMock.mockResolvedValue(
      createResponse({
        ok: true,
        status: 200,
        body: {
          success: true,
          data: {
            query: QUERY,
            totalCount: 1,
            projects: [{ projectTitle: "필드가 부족한 프로젝트" }],
          },
          message: null,
        },
      }),
    );
    const { getZombieProjectSearchResults } = await import(
      "./get-zombie-project-search-results"
    );

    await expect(getZombieProjectSearchResults(QUERY)).rejects.toThrow(
      "중단 프로젝트 검색 응답 형식이 올바르지 않습니다.",
    );
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ProjectMarketProjectResponseItem } from "@/features/project-market/types";

const API_BASE_URL = "https://api.example.com";

function createProject(
  projectId: number,
  projectName: string,
): ProjectMarketProjectResponseItem {
  return {
    projectId,
    projectName,
    description: `${projectName} 설명`,
    category: "PROJECT",
    registeredDate: "2026-08-18",
    representativeImageUrl: "https://example.com/project.svg",
    images: [],
    tags: ["AI"],
    viewCount: 100,
    likeCount: 20,
    bookmarkCount: 5,
    sellerName: "테스트 판매자",
    price: 50000,
    bookmarked: false,
    zipFile: {
      originalFileName: "project.zip",
      fileSize: 2048,
      downloadUrl: "https://example.com/project.zip",
    },
    detailPath: `/projects/${projectId}`,
  };
}

function createResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response;
}

describe("프로젝트 마켓 검색 API", () => {
  const fetchMock = vi.fn<typeof fetch>();
  const saleProject = createProject(1, "판매 중인 AI 프로젝트");
  const nonSaleProject = createProject(2041, "판매 목록에 없는 AI 프로젝트");

  beforeEach(() => {
    vi.stubEnv("API_BASE_URL", API_BASE_URL);
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("일반 검색 결과를 현재 판매 프로젝트 ID로 제한한다", async () => {
    fetchMock
      .mockResolvedValueOnce(
        createResponse({
          success: true,
          data: {
            query: "AI",
            totalCount: 2,
            projects: [nonSaleProject, saleProject],
          },
          message: "검색 결과를 조회했습니다.",
        }),
      )
      .mockResolvedValueOnce(
        createResponse({
          success: true,
          data: [saleProject],
          message: null,
        }),
      );

    const { getProjectMarketSearchResults } = await import(
      "./get-project-market-search-results"
    );
    const results = await getProjectMarketSearchResults("AI");
    const expectedSearchUrl = new URL("/api/projects/search", API_BASE_URL);
    expectedSearchUrl.searchParams.set("q", "AI");

    expect(results.map((project) => project.id)).toEqual([1]);
    expect(fetchMock).toHaveBeenNthCalledWith(1, expectedSearchUrl.toString(), {
      cache: "no-store",
    });
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      `${API_BASE_URL}/api/projects/sell`,
      { cache: "no-store" },
    );
  });

  it("검색 API의 HTTP 오류에 상태 코드를 포함한다", async () => {
    fetchMock
      .mockResolvedValueOnce(createResponse(null, 503))
      .mockResolvedValueOnce(
        createResponse({ success: true, data: [saleProject], message: null }),
      );

    const { getProjectMarketSearchResults } = await import(
      "./get-project-market-search-results"
    );

    await expect(getProjectMarketSearchResults("AI")).rejects.toThrow(
      "프로젝트 검색에 실패했습니다. (503)",
    );
  });

  it("검색 결과 구조가 잘못되면 오류를 반환한다", async () => {
    fetchMock
      .mockResolvedValueOnce(
        createResponse({
          success: true,
          data: { query: "AI", totalCount: 1, projects: [{ projectId: "1" }] },
          message: null,
        }),
      )
      .mockResolvedValueOnce(
        createResponse({ success: true, data: [saleProject], message: null }),
      );

    const { getProjectMarketSearchResults } = await import(
      "./get-project-market-search-results"
    );

    await expect(getProjectMarketSearchResults("AI")).rejects.toThrow(
      "프로젝트 검색 응답 형식이 올바르지 않습니다.",
    );
  });
});

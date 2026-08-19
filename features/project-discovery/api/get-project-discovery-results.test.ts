import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ProjectDiscoveryResultsResponse } from "../types";

const API_BASE_URL = "https://api.example.com";
const QUERY = "AI 광고 관리 서비스";

const successResponse: ProjectDiscoveryResultsResponse = {
  success: true,
  data: {
    query: QUERY,
    matchedCategories: ["AI·인공지능", "마케팅·광고"],
    targets: ["PROJECT", "CONTEST", "IDEA", "AWARD"],
    projects: [],
    contests: [],
    ideas: [],
    awards: [],
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
  body: ProjectDiscoveryResultsResponse;
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
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("검색어만 쿼리 파라미터로 전달한다", async () => {
    fetchMock.mockResolvedValue(
      createResponse({ ok: true, status: 200, body: successResponse }),
    );
    const { getProjectDiscoveryResults } = await import(
      "./get-project-discovery-results"
    );

    await expect(getProjectDiscoveryResults(QUERY)).resolves.toEqual(
      successResponse.data,
    );
    const expectedUrl = new URL(
      "/api/ai/project-discovery/results",
      API_BASE_URL,
    );
    expectedUrl.searchParams.set("query", QUERY);
    expect(fetchMock).toHaveBeenCalledWith(
      expectedUrl.toString(),
      { cache: "no-store" },
    );
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
          success: false,
          data: null,
          message: "검색 결과를 조회하지 못했습니다.",
        },
      }),
    );
    const { getProjectDiscoveryResults } = await import(
      "./get-project-discovery-results"
    );

    await expect(getProjectDiscoveryResults(QUERY)).rejects.toThrow(
      "검색 결과를 조회하지 못했습니다.",
    );
  });
});

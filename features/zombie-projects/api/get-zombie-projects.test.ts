import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const API_BASE_URL = "https://api.example.com";
const project = {
  projectId: 1,
  projectName: "테스트 프로젝트",
  publicSummary: "테스트 설명",
  representativeImageUrl: "https://example.com/project.png",
  registrationPurpose: "ZOMBIE",
  event: null,
  categories: ["기술"],
  problemAreas: [],
  methods: [],
  tags: ["AI"],
  resultLevel: "SUBMISSION_OUTPUT",
  activityStatus: "PAUSED",
  assets: { count: 1, categories: ["CODE"] },
  awards: [],
  informationCompletenessScore: 72,
  registeredAt: "2026-08-18",
  stats: { viewCount: 120, likeCount: 30, bookmarkCount: 12 },
  bookmarked: false,
  transferScope: null,
  priceType: null,
  price: null,
  reusableAssets: [{ assetId: 9, title: "소스", assetType: "CODE", role: "프로토타입", license: "MIT", attribution: null, reuseConditions: "저작권 표시", publicSource: "https://example.com/source" }],
} as const;

function response(ok: boolean, status: number, body: unknown) {
  return { ok, status, json: vi.fn().mockResolvedValue(body) } as unknown as Response;
}

describe("좀비 프로젝트 통합 목록 API", () => {
  const fetchMock = vi.fn<typeof fetch>();
  beforeEach(() => { vi.resetModules(); vi.stubEnv("API_BASE_URL", API_BASE_URL); vi.stubGlobal("fetch", fetchMock); fetchMock.mockReset(); });
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

  it("공통 목록에 ZOMBIE 목적과 페이지 크기를 전달한다", async () => {
    fetchMock.mockResolvedValue(response(true, 200, { success: true, data: { content: [project], page: 0, size: 50, totalElements: 1, totalPages: 1 } }));
    const { getZombieProjects } = await import("./get-zombie-projects");
    const result = await getZombieProjects();
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ id: 1, registrationPurpose: "ZOMBIE" });
    expect(result[0]).not.toHaveProperty("publicAssets");
    expect(JSON.stringify(result[0])).not.toContain("https://example.com/source");
    const expected = new URL("/api/projects", API_BASE_URL);
    expected.searchParams.set("registrationPurpose", "ZOMBIE");
    expected.searchParams.set("size", "50");
    expect(fetchMock).toHaveBeenCalledWith(expected, { cache: "no-store" });
  });

  it("HTTP 오류에는 공통 API의 상태 코드를 포함한다", async () => {
    fetchMock.mockResolvedValue(response(false, 503, null));
    const { getZombieProjects } = await import("./get-zombie-projects");
    await expect(getZombieProjects()).rejects.toThrow("프로젝트 목록을 불러오지 못했습니다. (503)");
  });

  it("실패 응답의 서버 메시지를 반환한다", async () => {
    fetchMock.mockResolvedValue(response(false, 400, { success: false, message: "좀비 프로젝트를 조회할 수 없습니다." }));
    const { getZombieProjects } = await import("./get-zombie-projects");
    await expect(getZombieProjects()).rejects.toThrow("좀비 프로젝트를 조회할 수 없습니다.");
  });

  it("성공 응답의 공통 목록 구조가 잘못되면 거부한다", async () => {
    fetchMock.mockResolvedValue(response(true, 200, { success: true, data: { content: [{ projectId: "invalid" }], page: 0, size: 50, totalElements: 1, totalPages: 1 } }));
    const { getZombieProjects } = await import("./get-zombie-projects");
    await expect(getZombieProjects()).rejects.toThrow("프로젝트 목록 응답 형식이 올바르지 않습니다.");
  });
});

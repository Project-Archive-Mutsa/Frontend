import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ZombieProjectsResponse } from "@/features/zombie-projects/types";

const API_BASE_URL = "https://api.example.com";

const successResponse: ZombieProjectsResponse = {
  success: true,
  data: [
    {
      projectId: 1,
      projectName: "테스트 프로젝트",
      description: "테스트 설명",
      registeredDate: "2026-08-18",
      representativeImageUrl: "https://example.com/project.png",
      tags: ["AI", "아카이브"],
      viewCount: 120,
      likeCount: 30,
      bookmarkCount: 12,
      sellerName: "테스트 판매자",
      price: 150000,
      zipFile: {
        originalFileName: "project.zip",
        fileSize: 2048,
        downloadUrl: "https://example.com/project.zip",
      },
      detailPath: "/projects/1",
    },
  ],
  message: null,
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

describe("좀비 프로젝트 목록 API", () => {
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

  it("좀비 프로젝트 엔드포인트를 캐시 없이 호출한다", async () => {
    fetchMock.mockResolvedValue(
      createResponse({ ok: true, status: 200, body: successResponse }),
    );
    const { getZombieProjects } = await import("./get-zombie-projects");

    await expect(getZombieProjects()).resolves.toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE_URL}/api/projects/zombie`,
      { cache: "no-store" },
    );
  });

  it("HTTP 오류에 상태 코드를 포함한다", async () => {
    fetchMock.mockResolvedValue(
      createResponse({ ok: false, status: 503, body: null }),
    );
    const { getZombieProjects } = await import("./get-zombie-projects");

    await expect(getZombieProjects()).rejects.toThrow(
      "좀비 프로젝트 조회에 실패했습니다. (503)",
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
          message: "좀비 프로젝트를 조회할 수 없습니다.",
        },
      }),
    );
    const { getZombieProjects } = await import("./get-zombie-projects");

    await expect(getZombieProjects()).rejects.toThrow(
      "좀비 프로젝트를 조회할 수 없습니다.",
    );
  });

  it("성공 응답의 프로젝트 구조가 잘못되면 오류를 반환한다", async () => {
    fetchMock.mockResolvedValue(
      createResponse({
        ok: true,
        status: 200,
        body: {
          success: true,
          data: [{ projectId: "잘못된 식별자" }],
          message: null,
        },
      }),
    );
    const { getZombieProjects } = await import("./get-zombie-projects");

    await expect(getZombieProjects()).rejects.toThrow(
      "좀비 프로젝트 응답 형식이 올바르지 않습니다.",
    );
  });
});

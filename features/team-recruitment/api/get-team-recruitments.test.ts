import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { TeamRecruitmentsResponse } from "@/features/team-recruitment/types";

const API_BASE_URL = "https://api.example.com";

const successResponse: TeamRecruitmentsResponse = {
  success: true,
  data: [
    {
      id: 1,
      title: "프론트엔드 팀원 모집",
      description: "React 개발자를 찾습니다.",
      roles: ["Frontend", "Designer"],
      deadline: "2026-08-20",
      detailUrl: "/recruitments/1",
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

describe("팀원 모집 목록 API", () => {
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

  it("모집 목록 엔드포인트를 캐시 없이 호출한다", async () => {
    fetchMock.mockResolvedValue(
      createResponse({ ok: true, status: 200, body: successResponse }),
    );
    const { getTeamRecruitments } = await import("./get-team-recruitments");

    await expect(getTeamRecruitments()).resolves.toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE_URL}/api/recruitments`,
      { cache: "no-store" },
    );
  });

  it("HTTP 오류에 상태 코드를 포함한다", async () => {
    fetchMock.mockResolvedValue(
      createResponse({ ok: false, status: 503, body: null }),
    );
    const { getTeamRecruitments } = await import("./get-team-recruitments");

    await expect(getTeamRecruitments()).rejects.toThrow(
      "팀원 모집글 조회에 실패했습니다. (503)",
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
          message: "모집글을 조회할 수 없습니다.",
        },
      }),
    );
    const { getTeamRecruitments } = await import("./get-team-recruitments");

    await expect(getTeamRecruitments()).rejects.toThrow(
      "모집글을 조회할 수 없습니다.",
    );
  });

  it("성공 응답의 모집글 구조가 잘못되면 오류를 반환한다", async () => {
    fetchMock.mockResolvedValue(
      createResponse({
        ok: true,
        status: 200,
        body: {
          success: true,
          data: [{ id: "잘못된 식별자" }],
          message: null,
        },
      }),
    );
    const { getTeamRecruitments } = await import("./get-team-recruitments");

    await expect(getTeamRecruitments()).rejects.toThrow(
      "팀원 모집글 응답 형식이 올바르지 않습니다.",
    );
  });
});

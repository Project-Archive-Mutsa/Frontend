import { beforeEach, describe, expect, it, vi } from "vitest";

import { getAuthSessionStatus } from "./get-auth-session-status";

const fetchMock = vi.fn();

describe("인증 세션 상태 조회", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  it.each([
    [200, "authenticated"],
    [401, "unauthenticated"],
    [503, "unknown"],
  ] as const)("응답 상태 %i를 %s 상태로 변환한다", async (status, expected) => {
    fetchMock.mockResolvedValue(new Response(null, { status }));

    await expect(getAuthSessionStatus()).resolves.toBe(expected);
    expect(fetchMock).toHaveBeenCalledWith("/api/auth/session", {
      cache: "no-store",
      credentials: "include",
      signal: undefined,
    });
  });

  it("네트워크 오류는 기존 UI 상태를 보존할 수 있도록 unknown으로 반환한다", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(getAuthSessionStatus()).resolves.toBe("unknown");
  });
});

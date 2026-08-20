import { beforeEach, describe, expect, it, vi } from "vitest";

import { logout } from "./logout";

const fetchMock = vi.fn();

describe("로그아웃 요청", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("인증 쿠키가 포함되는 동일 출처 로그아웃 요청을 보낸다", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await logout();

    expect(fetchMock).toHaveBeenCalledWith("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  });

  it("쿠키 삭제 요청이 실패하면 사용자에게 보여줄 오류를 반환한다", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 500 }));

    await expect(logout()).rejects.toThrow(
      "로그아웃하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    );
  });
});

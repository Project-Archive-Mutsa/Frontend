import { beforeEach, describe, expect, it, vi } from "vitest";

import { AUTH_SESSION_COOKIE_NAME } from "@/shared/auth/lib/auth-session-cookie";

const { deleteCookieMock } = vi.hoisted(() => ({
  deleteCookieMock: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({ delete: deleteCookieMock }),
}));

import { POST } from "./route";

describe("로그아웃 Route Handler", () => {
  beforeEach(() => {
    deleteCookieMock.mockReset();
  });

  it("Spring 세션 쿠키를 삭제한다", async () => {
    const response = await POST();

    expect(deleteCookieMock).toHaveBeenCalledWith(AUTH_SESSION_COOKIE_NAME);
    expect(response.status).toBe(204);
  });
});

import type { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AUTH_SESSION_COOKIE_NAME } from "@/shared/auth/lib/auth-session-cookie";
import { GET } from "./route";

const fetchMock = vi.fn();

function createRequest(cookieValue?: string) {
  return {
    cookies: {
      get: vi.fn(() =>
        cookieValue
          ? { name: AUTH_SESSION_COOKIE_NAME, value: cookieValue }
          : undefined,
      ),
    },
  } as unknown as NextRequest;
}

describe("인증 세션 검증 Route Handler", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubEnv("API_BASE_URL", "https://api.example.com");
    vi.stubGlobal("fetch", fetchMock);
  });

  it("세션 쿠키가 없으면 백엔드를 호출하지 않고 비로그인으로 응답한다", async () => {
    const response = await GET(createRequest());

    expect(response.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("세션 쿠키만 전달해 백엔드의 보호 API로 유효성을 검증한다", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 200 }));

    const response = await GET(createRequest("session id"));

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(
      new URL("/api/members/me/points", "https://api.example.com"),
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          Cookie: "JSESSIONID=session%20id",
        },
      },
    );
  });

  it("만료된 백엔드 세션은 비로그인으로 응답한다", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 401 }));

    const response = await GET(createRequest("expired-session"));

    expect(response.status).toBe(401);
  });

  it("백엔드 장애를 로그아웃으로 오인하지 않는다", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 500 }));

    const response = await GET(createRequest("active-session"));

    expect(response.status).toBe(503);
  });
});

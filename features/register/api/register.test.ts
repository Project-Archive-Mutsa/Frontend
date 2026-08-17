import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { RegisterRequest, RegisterResponse } from "../model/types";

const API_BASE_URL = "https://api.example.com";
const REGISTER_URL = `${API_BASE_URL}/api/auth/signup`;

const registerRequest: RegisterRequest = {
  loginId: "test-user",
  email: "test@example.com",
  password: "password123!",
  passwordConfirm: "password123!",
  name: "홍길동",
  phoneNumber: "010-1234-5678",
  school: "테스트대학교",
  department: "컴퓨터공학과",
  selectedTagIds: [66, 68],
};

const successResponse: RegisterResponse = {
  success: true,
  data: {
    userId: 1,
    email: registerRequest.email,
    nickname: registerRequest.name,
  },
  message: "회원가입이 완료되었습니다.",
};

function createResponse({
  ok,
  status,
  body,
}: {
  ok: boolean;
  status: number;
  body: RegisterResponse | null;
}) {
  return {
    ok,
    status,
    json: body
      ? vi.fn().mockResolvedValue(body)
      : vi.fn().mockRejectedValue(new SyntaxError("응답이 JSON이 아닙니다.")),
  } as unknown as Response;
}

describe("회원가입 API", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", API_BASE_URL);
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("회원가입 값을 JSON으로 전송한다", async () => {
    fetchMock.mockResolvedValue(
      createResponse({ ok: true, status: 200, body: successResponse }),
    );
    const { register } = await import("./register");

    await expect(register(registerRequest)).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith(REGISTER_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerRequest),
    });
  });

  it("서버가 전달한 실패 메시지를 사용자 오류로 반환한다", async () => {
    fetchMock.mockResolvedValue(
      createResponse({
        ok: false,
        status: 409,
        body: {
          success: false,
          data: null,
          message: "이미 사용 중인 아이디입니다.",
        },
      }),
    );
    const { register } = await import("./register");

    await expect(register(registerRequest)).rejects.toThrow(
      "이미 사용 중인 아이디입니다.",
    );
  });

  it("HTTP 200이어도 success가 false이면 실패로 처리한다", async () => {
    fetchMock.mockResolvedValue(
      createResponse({
        ok: true,
        status: 200,
        body: {
          success: false,
          data: null,
          message: "회원가입 요청을 처리하지 못했습니다.",
        },
      }),
    );
    const { register } = await import("./register");

    await expect(register(registerRequest)).rejects.toThrow(
      "회원가입 요청을 처리하지 못했습니다.",
    );
  });

  it("서버 오류 응답이 JSON이 아니면 상태 코드를 포함한 기본 오류를 반환한다", async () => {
    fetchMock.mockResolvedValue(
      createResponse({ ok: false, status: 500, body: null }),
    );
    const { register } = await import("./register");

    await expect(register(registerRequest)).rejects.toThrow(
      "회원가입에 실패했습니다. (500)",
    );
  });
});

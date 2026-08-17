import type { LoginRequest, LoginResponse } from "../model/types";

const LOGIN_PATH = "/api/auth/login";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function login(loginValue: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}${LOGIN_PATH}`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginValue),
  });

  const result = (await response.json()) as LoginResponse;

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || `로그인에 실패했습니다. (${response.status})`,
    );
  }

  return result;
}

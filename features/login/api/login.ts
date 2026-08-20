import type { LoginRequest, LoginResponse } from "../model/types";
import { getClientApiUrl } from "@/shared/api/client-api-url";

const LOGIN_PATH = "/api/auth/login";

export async function login(loginValue: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(getClientApiUrl(LOGIN_PATH), {
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

import type { RegisterRequest, RegisterResponse } from "../model/types";
import { getClientApiUrl } from "@/shared/api/client-api-url";

const REGISTER_PATH = "/api/auth/signup";

export async function register(registerValue: RegisterRequest): Promise<void> {
  const response = await fetch(getClientApiUrl(REGISTER_PATH), {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerValue),
  });

  const result = (await response
    .json()
    .catch(() => null)) as RegisterResponse | null;

  if (!response.ok || !result?.success) {
    throw new Error(
      result?.message || `회원가입에 실패했습니다. (${response.status})`,
    );
  }
}

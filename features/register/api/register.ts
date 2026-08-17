import type { RegisterRequest, RegisterResponse } from "../model/types";

const REGISTER_PATH = "/api/auth/signup";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function register(registerValue: RegisterRequest): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${REGISTER_PATH}`, {
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

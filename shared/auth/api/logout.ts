import { getClientApiUrl } from "@/shared/api/client-api-url";

export async function logout() {
  const response = await fetch(getClientApiUrl("/api/auth/logout"), {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("로그아웃하지 못했습니다. 잠시 후 다시 시도해 주세요.");
  }
}

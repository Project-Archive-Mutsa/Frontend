import { getClientApiUrl } from "@/shared/api/client-api-url";

export type AuthSessionStatus =
  | "authenticated"
  | "unauthenticated"
  | "unknown";

export async function getAuthSessionStatus(
  signal?: AbortSignal,
): Promise<AuthSessionStatus> {
  try {
    const response = await fetch(getClientApiUrl("/api/auth/session"), {
      cache: "no-store",
      credentials: "include",
      signal,
    });

    if (response.ok) {
      return "authenticated";
    }

    if (response.status === 401) {
      return "unauthenticated";
    }

    return "unknown";
  } catch (error) {
    if (signal?.aborted) {
      throw error;
    }

    return "unknown";
  }
}

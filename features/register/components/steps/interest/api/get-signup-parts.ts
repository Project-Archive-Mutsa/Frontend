import type { RegisterPart, SignupPartsResponse } from "../model/types";
import { getClientApiUrl } from "@/shared/api/client-api-url";

const SIGNUP_PARTS_PATH = "/api/signup/parts";

export async function getSignupParts(): Promise<RegisterPart[]> {
  const response = await fetch(getClientApiUrl(SIGNUP_PARTS_PATH), {
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  const result = (await response.json()) as SignupPartsResponse;

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || `관심 태그를 불러오지 못했습니다. (${response.status})`,
    );
  }

  return result.data;
}

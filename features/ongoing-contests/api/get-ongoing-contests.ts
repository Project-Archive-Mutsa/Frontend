import type { OngoingContest } from "@/features/ongoing-contests/types";
import { getApiError, readJson } from "@/shared/api/api-error";
import { mapOngoingContest } from "./map-ongoing-contest";
import { getServerApiUrl } from "@/shared/api/server-api-url";
import { ongoingContestsResponseSchema } from "./ongoing-contests-response-schema";

const ONGOING_CONTESTS_PATH = "/api/contests/active";

export async function getOngoingContests(): Promise<
  readonly OngoingContest[]
> {
  const response = await fetch(
    getServerApiUrl(ONGOING_CONTESTS_PATH),
    {
      cache: "no-store",
    },
  );

  const payload = await readJson(response);

  if (!response.ok) {
    throw getApiError(
      payload,
      response.status,
      "진행 중인 공모전 조회에 실패했습니다.",
    );
  }

  const parsed = ongoingContestsResponseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("진행 중인 공모전 응답 형식이 올바르지 않습니다.");
  }

  return parsed.data.data.map(mapOngoingContest);
}

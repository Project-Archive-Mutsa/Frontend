import type {
  OngoingContest,
  OngoingContestsResponse,
} from "@/features/ongoing-contests/types";
import { mapOngoingContest } from "./map-ongoing-contest";
import { getServerApiUrl } from "@/shared/api/server-api-url";

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

  if (!response.ok) {
    throw new Error(
      `진행 중인 공모전 조회에 실패했습니다. (${response.status})`,
    );
  }

  const result = (await response.json()) as OngoingContestsResponse;

  if (!result.success || !Array.isArray(result.data)) {
    throw new Error(
      result.message ?? "진행 중인 공모전 응답 형식이 올바르지 않습니다.",
    );
  }

  return result.data.map(mapOngoingContest);
}

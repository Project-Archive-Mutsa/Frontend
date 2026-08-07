import { ongoingContestPosters } from "@/mocks/ongoing-contests/dummy-data";
import type { OngoingContestPoster } from "@/mocks/ongoing-contests/types";

export async function getOngoingContestPosters(): Promise<
  readonly OngoingContestPoster[]
> {
  // TODO: 백엔드 연결 시 mock 반환을 Axios 요청으로 교체
  return ongoingContestPosters;
}

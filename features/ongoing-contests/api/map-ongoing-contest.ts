import type {
  OngoingContest,
  OngoingContestResponseItem,
} from "@/features/ongoing-contests/types";

export function mapOngoingContest(
  contest: OngoingContestResponseItem,
): OngoingContest {
  return {
    id: contest.contestId,
    title: contest.contestName,
    description: contest.description,
    imageUrl: contest.representativeImageUrl,
    startDate: contest.startDate,
    endDate: contest.endDate,
    detailUrl: contest.detailPath,
  };
}

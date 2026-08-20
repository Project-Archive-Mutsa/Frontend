import type { OngoingContest } from "@/features/ongoing-contests/types";
import type { OngoingContestResponseItem } from "./ongoing-contests-response-schema";

function getImageUrl(contest: OngoingContestResponseItem) {
  const representativeImageUrl = contest.representativeImageUrl?.trim();
  if (representativeImageUrl) {
    return representativeImageUrl;
  }

  const image =
    contest.images.find((candidate) => candidate.representative) ??
    contest.images[0];

  return image?.imageUrl.trim() || null;
}

function getApplyUrl(value: string | null) {
  const candidate = value?.trim();
  if (!candidate) {
    return null;
  }

  try {
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:"
      ? candidate
      : null;
  } catch {
    return null;
  }
}

export function mapOngoingContest(
  contest: OngoingContestResponseItem,
): OngoingContest {
  return {
    id: contest.contestId,
    title: contest.contestName,
    description: contest.description,
    imageUrl: getImageUrl(contest),
    startDate: contest.startDate,
    endDate: contest.endDate,
    applyUrl: getApplyUrl(contest.applyUrl),
    detailUrl: contest.detailPath,
  };
}

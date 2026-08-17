import { getOngoingContests } from "@/features/ongoing-contests/api/get-ongoing-contests";
import OngoingContestCarousel from "./ongoing-contest-carousel";

export default async function OngoingContestList() {
  const contests = await getOngoingContests();

  if (contests.length === 0) {
    return <p>현재 진행 중인 공모전이 없습니다.</p>;
  }

  return <OngoingContestCarousel contests={contests} />;
}

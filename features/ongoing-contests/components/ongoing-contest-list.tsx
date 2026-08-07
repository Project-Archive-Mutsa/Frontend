import { getOngoingContestPosters } from "@/features/ongoing-contests/api/get-ongoing-contest-posters";
import OngoingContestItem from "./ongoing-contest-item";

export default async function OngoingContestList() {
  const posters = await getOngoingContestPosters();

  if (posters.length === 0) {
    return <p>현재 진행 중인 공모전이 없습니다.</p>;
  }

  return (
    <ul className="flex gap-5">
      {posters.map((poster) => (
        <li key={poster.href}>
          <OngoingContestItem poster={poster} />
        </li>
      ))}
    </ul>
  );
}

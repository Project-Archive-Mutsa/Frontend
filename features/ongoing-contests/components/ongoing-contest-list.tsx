import { getOngoingContests } from "@/features/ongoing-contests/api/get-ongoing-contests";
import OngoingContestItem from "./ongoing-contest-item";

export default async function OngoingContestList() {
  const contests = await getOngoingContests();

  if (contests.length === 0) {
    return <p>현재 진행 중인 공모전이 없습니다.</p>;
  }

  return (
    <div className="relative">
      <button
        type="button"
        disabled
        aria-label="이전 공모전"
        className="absolute top-[38%] -left-16 hidden size-11 items-center justify-center rounded-full border border-[#d8dde2] bg-white text-[#48647d] shadow-[0_10px_25px_-18px_rgba(25,54,80,0.8)] xl:flex"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="m14.5 6-6 6 6 6" />
        </svg>
      </button>

      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
        {contests.map((contest, index) => (
          <li key={contest.id} className="h-full">
            <OngoingContestItem contest={contest} index={index} />
          </li>
        ))}
      </ul>

      <button
        type="button"
        disabled
        aria-label="다음 공모전"
        className="absolute top-[38%] -right-16 hidden size-11 items-center justify-center rounded-full border border-[#d8dde2] bg-white text-[#48647d] shadow-[0_10px_25px_-18px_rgba(25,54,80,0.8)] xl:flex"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="m9.5 6 6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}

import Link from "next/link";
import type { OngoingContest } from "@/features/ongoing-contests/types";
import OngoingContestPoster from "./ongoing-contest-poster";

interface OngoingContestItemProps {
  contest: OngoingContest;
  index: number;
}

export default function OngoingContestItem({
  contest,
  index,
}: OngoingContestItemProps) {
  return (
    <Link
      href={contest.detailUrl}
      className="group block h-full rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#317bb8] focus-visible:ring-offset-4"
    >
      <article className="h-full">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-[#d9dde1] bg-[#f2f3f2] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_24px_50px_-34px_rgba(21,53,82,0.55)]">
          <OngoingContestPoster contest={contest} index={index} />
        </div>
        <div className="pt-5">
          <p className="text-[11px] font-bold tracking-[0.12em] text-[#678099] uppercase">
            {contest.startDate} — {contest.endDate}
          </p>
          <h3 className="mt-2 text-xl font-bold tracking-[-0.035em] text-[#152f49] transition-colors group-hover:text-[#17659f]">
            {contest.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6a747d]">
            {contest.description}
          </p>
        </div>
      </article>
    </Link>
  );
}

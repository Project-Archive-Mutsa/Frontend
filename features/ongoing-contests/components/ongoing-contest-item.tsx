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
  const card = (
    <article className="flex h-full flex-col">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-[#d9dde1] bg-[#f2f3f2] transition-colors group-hover:border-[#a9bfd0]">
        <OngoingContestPoster contest={contest} index={index} />
      </div>
      <div className="flex flex-1 flex-col pt-5">
        <p className="text-[11px] font-bold tracking-[0.12em] whitespace-nowrap text-[#678099] uppercase">
          {contest.startDate} — {contest.endDate}
        </p>
        <h3 className="font-display mt-2 text-pretty break-keep text-xl font-semibold tracking-[-0.02em] text-[#152f49] transition-colors group-hover:text-[#17659f]">
          {contest.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-pretty break-keep text-sm leading-6 text-[#6a747d]">
          {contest.description}
        </p>
        <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#17659f]">
          {contest.applyUrl ? "공모전 사이트 보기" : "상세 보기"}
          {contest.applyUrl ? (
            <>
              <span className="sr-only">(새 탭)</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path d="M7 13 13 7" />
                <path d="M8 7h5v5" />
              </svg>
            </>
          ) : null}
        </p>
      </div>
    </article>
  );

  const className =
    "group block h-full rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#317bb8] focus-visible:ring-offset-4";

  if (contest.applyUrl) {
    return (
      <a
        href={contest.applyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {card}
      </a>
    );
  }

  return (
    <Link href={contest.detailUrl} className={className}>
      {card}
    </Link>
  );
}

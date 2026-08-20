"use client";

import Image from "next/image";
import { useState } from "react";
import type { OngoingContest } from "@/features/ongoing-contests/types";

interface OngoingContestPosterProps {
  contest: OngoingContest;
  index: number;
}

const fallbackStyles = [
  "bg-[#efe1bd] text-[#7c3f1d]",
  "bg-[#f4f5f2] text-[#05ad5b]",
  "bg-[#f27000] text-[#8e1821]",
];

export default function OngoingContestPoster({
  contest,
  index,
}: OngoingContestPosterProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const fallbackStyle = fallbackStyles[index % fallbackStyles.length];

  if (contest.imageUrl && !hasImageError) {
    return (
      <Image
        src={contest.imageUrl}
        alt={`${contest.title} 공모전 포스터`}
        fill
        unoptimized={contest.imageUrl.endsWith(".svg")}
        sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
        className="object-cover"
        onError={() => setHasImageError(true)}
      />
    );
  }

  if (contest.id === 3) {
    return (
      <Image
        src="/contest-posters/animal-league-hackathon.png"
        alt="동물 캐릭터와 트로피가 있는 애니멀리그 해커톤 포스터"
        fill
        sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
        className="bg-[#f27000] object-contain"
      />
    );
  }

  return (
    <div
      className={`relative flex size-full flex-col justify-between overflow-hidden p-7 sm:p-8 ${fallbackStyle}`}
    >
      <div
        aria-hidden="true"
        className="absolute -top-12 -right-12 size-40 rounded-full border-[28px] border-current opacity-10"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-16 -left-10 size-44 rotate-12 rounded-[2.5rem] border-[24px] border-current opacity-10"
      />
      <p className="relative text-[10px] font-bold tracking-[0.18em] uppercase opacity-75">
        Open Challenge · 2026
      </p>
      <div className="relative">
        <p className="text-4xl leading-[0.94] font-black tracking-[-0.065em] uppercase sm:text-5xl">
          {index % fallbackStyles.length === 1 ? (
            <>
              AI Agent
              <br />
              Challenge
            </>
          ) : (
            contest.title
          )}
        </p>
        <div className="mt-6 h-1 w-14 rounded-full bg-current opacity-65" />
        <p className="mt-4 text-xs leading-5 font-semibold opacity-80">
          {contest.startDate} — {contest.endDate}
        </p>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import type { OngoingContest } from "@/features/ongoing-contests/types";
import OngoingContestItem from "./ongoing-contest-item";

interface OngoingContestCarouselProps {
  contests: readonly OngoingContest[];
}

export default function OngoingContestCarousel({
  contests,
}: OngoingContestCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return;
    }

    function updateScrollState() {
      if (!scrollContainer) {
        return;
      }

      const maximumScrollLeft =
        scrollContainer.scrollWidth - scrollContainer.clientWidth;

      setCanScrollPrevious(scrollContainer.scrollLeft > 1);
      setCanScrollNext(scrollContainer.scrollLeft < maximumScrollLeft - 1);
    }

    updateScrollState();
    scrollContainer.addEventListener("scroll", updateScrollState, {
      passive: true,
    });

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(scrollContainer);

    return () => {
      scrollContainer.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [contests.length]);

  function scroll(direction: "previous" | "next") {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return;
    }

    scrollContainer.scrollBy({
      left:
        direction === "previous"
          ? -scrollContainer.clientWidth
          : scrollContainer.clientWidth,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative px-16 lg:px-20">
      <div className="pointer-events-none absolute inset-x-16 top-0 z-10 lg:inset-x-20">
        <div className="aspect-[3/4] w-[85%] sm:w-[calc((100%_-_2rem)/2)] lg:w-[calc((100%_-_3.5rem)/3)]" />

        <button
          type="button"
          aria-label="이전 공모전 보기"
          disabled={!canScrollPrevious}
          onClick={() => scroll("previous")}
          className="text-brand hover:text-brand-accent focus-visible:outline-brand-accent pointer-events-auto absolute top-1/2 -left-16 flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:text-slate-400 motion-reduce:transition-none lg:-left-20"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-8"
          >
            <path d="m15 4-8 8 8 8" />
          </svg>
        </button>

        <button
          type="button"
          aria-label="다음 공모전 보기"
          disabled={!canScrollNext}
          onClick={() => scroll("next")}
          className="text-brand hover:text-brand-accent focus-visible:outline-brand-accent pointer-events-auto absolute top-1/2 -right-16 flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:text-slate-400 motion-reduce:transition-none lg:-right-20"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-8"
          >
            <path d="m9 4 8 8-8 8" />
          </svg>
        </button>
      </div>

      <div
        ref={scrollContainerRef}
        className="snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <ul className="grid auto-cols-[85%] grid-flow-col gap-8 sm:auto-cols-[calc((100%_-_2rem)/2)] lg:auto-cols-[calc((100%_-_3.5rem)/3)] lg:gap-7">
          {contests.map((contest, index) => (
            <li key={contest.id} className="h-full snap-start">
              <OngoingContestItem contest={contest} index={index} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

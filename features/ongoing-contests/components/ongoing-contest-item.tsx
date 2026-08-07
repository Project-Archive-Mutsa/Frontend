import Image from "next/image";
import type { OngoingContestPoster } from "@/mocks/ongoing-contests/types";

interface OngoingContestItemProps {
  poster: OngoingContestPoster;
}

export default function OngoingContestItem({
  poster,
}: OngoingContestItemProps) {
  return (
    <a href={poster.href} target="_blank" rel="noopener noreferrer">
      <Image src={poster.src} alt={poster.alt} width={240} height={240} />
    </a>
  );
}

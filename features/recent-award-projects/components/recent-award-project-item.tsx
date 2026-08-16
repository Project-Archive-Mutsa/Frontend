import Image from "next/image";
import Link from "next/link";
import type { RecentAwardProject } from "@/mocks/recent-award-projects/types";

interface RecentAwardProjectItemProps {
  project: RecentAwardProject;
}

export default function RecentAwardProjectItem({
  project,
}: RecentAwardProjectItemProps) {
  return (
    <Link
      href={`/project-market/${project.slug}`}
      className="group block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#317bb8] focus-visible:ring-offset-4"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#d7e3ee] bg-white shadow-[0_18px_40px_-32px_rgba(20,62,100,0.75)] transition duration-300 group-hover:-translate-y-1 group-hover:border-[#b6cee2] group-hover:shadow-[0_22px_48px_-28px_rgba(20,62,100,0.62)]">
        <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-gradient-to-br from-[#e5f5ff] via-[#f5fbff] to-[#d8e9f7]">
          <Image
            src={project.representativeImage.src}
            alt={project.representativeImage.alt}
            width={86}
            height={86}
            className="size-20 object-contain opacity-80 transition-transform duration-300 group-hover:scale-105"
          />
          <span className="absolute top-4 right-4 rounded-full border border-[#f4d58d] bg-[#fff5d8] px-2.5 py-1 text-[10px] font-bold text-[#986412]">
            {project.award.title}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <p className="text-[11px] font-bold tracking-[0.1em] text-[#4f82b1] uppercase">
            {project.category}
          </p>
          <h3 className="mt-2 text-lg font-bold tracking-[-0.03em] text-[#173f68] transition-colors group-hover:text-[#0f67a8]">
            {project.name}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#687e93]">
            {project.summary}
          </p>
          <p className="mt-4 text-xs leading-5 font-medium text-[#405f7c]">
            {project.award.competitionName}
          </p>
          <div className="mt-auto flex items-center justify-between border-t border-[#e8eef4] pt-4 text-[11px] text-[#72869a]">
            <time dateTime={project.award.awardedAt}>
              {project.award.awardedAt}
            </time>
            <span>
              조회 {project.stats.viewCount} · 좋아요 {project.stats.likeCount}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

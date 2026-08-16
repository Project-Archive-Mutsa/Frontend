import Link from "next/link";
import type { PopularProject } from "@/features/popular-projects/types";

interface PopularProjectItemProps {
  project: PopularProject;
}

export default function PopularProjectItem({
  project,
}: PopularProjectItemProps) {
  return (
    <Link
      href={project.detailUrl}
      className="group block rounded-lg py-6 outline-none focus-visible:ring-2 focus-visible:ring-[#317bb8] focus-visible:ring-offset-4 sm:py-7"
    >
      <article className="grid gap-5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center sm:gap-7">
        <div
          aria-hidden="true"
          className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-xl bg-[#e7f1f7] bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.02] sm:aspect-square"
          style={{ backgroundImage: `url(${project.thumbnailUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#eff7fb]/88 via-[#f8fbfd]/75 to-[#d8e8f2]/88" />
          <div className="relative flex size-14 items-end gap-1.5 rounded-xl border border-white/70 bg-white/60 p-3 backdrop-blur-sm">
            <span className="h-4 w-2 rounded-sm bg-[#8bb8d4]" />
            <span className="h-7 w-2 rounded-sm bg-[#4f83a8]" />
            <span className="h-10 w-2 rounded-sm bg-[#244f70]" />
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#6c7f90]">
                <span className="font-bold tracking-[0.12em] text-[#4f7593] uppercase">
                  Project
                </span>
                <span aria-hidden="true">·</span>
                <time dateTime={project.registeredDate}>
                  {project.registeredDate} 등록
                </time>
              </div>
              <h3 className="mt-2 text-xl font-bold tracking-[-0.03em] text-[#183a57] transition-colors group-hover:text-[#0f65a5] sm:text-2xl">
                {project.name}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#65788a]">
                {project.description}
              </p>
            </div>
            <span
              aria-label={project.bookmarked ? "북마크됨" : "북마크되지 않음"}
              className="shrink-0 text-xl text-[#6e8499]"
            >
              {project.bookmarked ? "★" : "☆"}
            </span>
          </div>

          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="프로젝트 태그">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-md border border-[#d5e2eb] bg-white/70 px-2 py-1 text-[11px] font-medium text-[#5f7283]"
              >
                {tag}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#637688]">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span>조회 {project.viewCount.toLocaleString("ko-KR")}</span>
              <span>좋아요 {project.likeCount.toLocaleString("ko-KR")}</span>
              <span>저장 {project.bookmarkCount.toLocaleString("ko-KR")}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="truncate">
                {project.teamMembers.join(" · ")}
              </span>
              {project.price > 0 ? (
                <strong className="whitespace-nowrap text-[#214e70]">
                  {project.price.toLocaleString("ko-KR")}원
                </strong>
              ) : null}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

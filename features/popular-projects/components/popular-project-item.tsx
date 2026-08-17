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
          className="aspect-[16/10] overflow-hidden rounded-xl bg-[#e7f1f7] bg-cover bg-center sm:aspect-square"
          style={{ backgroundImage: `url(${project.thumbnailUrl})` }}
        />

        <div className="min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs whitespace-nowrap text-[#6c7f90]">
                <time dateTime={project.registeredDate}>
                  {project.registeredDate} 등록
                </time>
              </div>
              <h3 className="mt-2 text-pretty break-keep text-xl font-bold tracking-[-0.03em] text-[#183a57] transition-colors group-hover:text-[#0f65a5] sm:text-2xl">
                {project.name}
              </h3>
              <p className="mt-2 line-clamp-2 text-pretty break-keep text-sm leading-6 text-[#65788a]">
                {project.description}
              </p>
            </div>
            {project.bookmarked ? (
              <span className="shrink-0 text-xs font-medium text-[#526e87]">
                저장됨
              </span>
            ) : null}
          </div>

          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="프로젝트 태그">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-md border border-[#d5e2eb] bg-white px-2 py-1 text-[11px] font-medium whitespace-nowrap text-[#5f7283]"
              >
                {tag}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#637688]">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="whitespace-nowrap">
                조회 {project.viewCount.toLocaleString("ko-KR")}
              </span>
              <span className="whitespace-nowrap">
                좋아요 {project.likeCount.toLocaleString("ko-KR")}
              </span>
              <span className="whitespace-nowrap">
                저장 {project.bookmarkCount.toLocaleString("ko-KR")}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="truncate">
                {project.sellerName}
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

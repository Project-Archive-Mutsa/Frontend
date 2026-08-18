import Image from "next/image";
import Link from "next/link";
import { formatFileSize } from "@/features/zombie-projects/lib/format-file-size";
import type { ZombieProject } from "@/features/zombie-projects/types";

interface ZombieProjectItemProps {
  project: ZombieProject;
}

export default function ZombieProjectItem({
  project,
}: ZombieProjectItemProps) {
  return (
    <Link
      href={project.detailPath}
      aria-label={`${project.name} 상세 보기`}
      className="group block px-2 py-7 outline-none transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 sm:px-3 sm:py-9 motion-reduce:transition-none"
    >
      <article className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-10">
        <div className="min-w-0">
          <time dateTime={project.registeredAt} className="text-xs text-[#63788c]">
            {project.registeredAt} 등록
          </time>
          <h2 className="mt-2 text-pretty break-keep text-2xl font-bold tracking-[-0.035em] text-[#173a59] transition-colors group-hover:text-[#0f65a5] sm:text-3xl motion-reduce:transition-none">
            {project.name}
          </h2>
          <p className="mt-3 line-clamp-3 max-w-3xl text-pretty break-keep text-sm leading-7 text-[#5d7285] sm:text-base">
            {project.description}
          </p>

          {project.tags.length > 0 ? (
            <ul
              className="mt-5 flex flex-wrap gap-x-3 gap-y-2 text-xs text-[#52697d]"
              aria-label="프로젝트 태그"
            >
              {project.tags.map((tag) => (
                <li key={tag} className="border-b border-[#aac3d6] pb-0.5">
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}

          <ul
            className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#63788c]"
            aria-label="프로젝트 통계"
          >
            <li>조회 {project.stats.viewCount.toLocaleString("ko-KR")}</li>
            <li>좋아요 {project.stats.likeCount.toLocaleString("ko-KR")}</li>
            <li>저장 {project.stats.bookmarkCount.toLocaleString("ko-KR")}</li>
          </ul>
        </div>

        <aside className="border-t border-[#dbe5ed] pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-7">
          {project.representativeImage ? (
            <div className="relative mb-5 aspect-[16/9] overflow-hidden bg-brand-soft">
              <Image
                src={project.representativeImage.src}
                alt={project.representativeImage.alt}
                fill
                unoptimized
                sizes="240px"
                className="object-cover"
              />
            </div>
          ) : null}

          <dl className="grid grid-cols-2 gap-x-5 gap-y-4 text-sm lg:grid-cols-1">
            <div className="min-w-0">
              <dt className="text-xs text-[#6b7f91]">판매자</dt>
              <dd className="mt-1 truncate font-medium text-[#294963]">
                {project.sellerName}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[#6b7f91]">등록 가격</dt>
              <dd className="mt-1 font-bold text-[#174f7a]">
                {project.price.toLocaleString("ko-KR")}원
              </dd>
            </div>
            <div className="col-span-2 min-w-0 lg:col-span-1">
              <dt className="text-xs text-[#6b7f91]">ZIP 파일</dt>
              <dd className="mt-1 text-[#405b71] [overflow-wrap:anywhere]">
                {project.zipFile ? (
                  <>
                    {project.zipFile.name}
                    <span className="whitespace-nowrap text-[#6b7f91]">
                      {" "}· {formatFileSize(project.zipFile.sizeInBytes)}
                    </span>
                  </>
                ) : (
                  "등록된 파일 없음"
                )}
              </dd>
            </div>
          </dl>
        </aside>
      </article>
    </Link>
  );
}

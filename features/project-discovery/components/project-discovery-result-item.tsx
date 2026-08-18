import Image from "next/image";
import Link from "next/link";
import type { ProjectDiscoveryResultItem as ProjectDiscoveryResultItemType } from "@/features/project-discovery/types";

interface ProjectDiscoveryResultItemProps {
  item: ProjectDiscoveryResultItemType;
}

export default function ProjectDiscoveryResultItem({
  item,
}: ProjectDiscoveryResultItemProps) {
  const similarityPercent = Math.round(item.similarityScore * 1000) / 10;
  const visibleTags = item.tags.slice(0, 6);
  const hiddenTagCount = item.tags.length - visibleTags.length;

  return (
    <Link
      href={item.detailPath}
      className="group block py-6 outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 sm:py-7"
    >
      <article className="grid gap-5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center sm:gap-7">
        <div className="relative aspect-[16/10] overflow-hidden border border-brand-soft bg-brand-canvas sm:aspect-square">
          {item.representativeImageUrl ? (
            <Image
              src={item.representativeImageUrl}
              alt={`${item.title} 대표 이미지`}
              fill
              sizes="(max-width: 640px) 100vw, 160px"
              unoptimized={item.representativeImageUrl.endsWith(".svg")}
              className="object-cover"
            />
          ) : (
            <span className="flex h-full items-center justify-center px-4 text-center text-xs text-[#73889b]">
              대표 이미지 없음
            </span>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-brand-accent">{item.category}</p>
              <h3 className="mt-1 text-pretty break-keep text-xl font-bold tracking-[-0.025em] text-[#173f68] transition-colors group-hover:text-[#0f65a5] sm:text-2xl">
                {item.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-pretty break-keep text-sm leading-6 text-[#62798d]">
                {item.description}
              </p>
            </div>

            <div className="w-full shrink-0 lg:w-32">
              <div className="flex items-center justify-between text-xs text-[#62798d]">
                <span>AI 유사도</span>
                <strong className="tabular-nums text-[#173f68]">
                  {similarityPercent}%
                </strong>
              </div>
              <div
                role="progressbar"
                aria-label={`${item.title} 유사도`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={similarityPercent}
                className="mt-2 h-1.5 overflow-hidden bg-brand-soft"
              >
                <div
                  className="h-full bg-brand-accent"
                  style={{ width: `${Math.min(similarityPercent, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {visibleTags.length > 0 ? (
            <ul
              aria-label={`${item.title} 태그`}
              className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[#60758a]"
            >
              {visibleTags.map((tag) => (
                <li key={tag}>#{tag}</li>
              ))}
              {hiddenTagCount > 0 ? <li>외 {hiddenTagCount}개</li> : null}
            </ul>
          ) : null}
        </div>
      </article>
    </Link>
  );
}

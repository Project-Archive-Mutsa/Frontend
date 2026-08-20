import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import ProjectInformationCompleteness from "@/shared/components/project-information-completeness/project-information-completeness";
import ProjectBookmarkButton from "@/shared/components/project-bookmark-button/project-bookmark-button";

export interface ProjectListCardContextItem {
  label: string;
  dateTime?: string;
}

export interface ProjectListCardFact {
  label: string;
  value: string;
}

export interface ProjectListCardStat {
  label: string;
  value: number;
}

interface ProjectListCardProps {
  title: string;
  summary: string;
  contextItems: readonly ProjectListCardContextItem[];
  tags: readonly string[];
  facts: readonly ProjectListCardFact[];
  representativeImage: {
    src: string;
    alt: string;
  } | null;
  informationCompletenessScore?: number | null;
  showInformationCompleteness?: boolean;
  registrantName?: string;
  registrantLabel?: string;
  stats?: readonly ProjectListCardStat[];
  headingLevel?: 2 | 3;
  href?: string;
  projectId?: number;
  bookmarked?: boolean;
  bookmarkReturnPath?: string;
  children?: ReactNode;
}

const MAX_VISIBLE_TAGS = 7;

export default function ProjectListCard({
  title,
  summary,
  contextItems,
  tags,
  facts,
  representativeImage,
  informationCompletenessScore,
  showInformationCompleteness = true,
  registrantName,
  registrantLabel = "등록자",
  stats = [],
  headingLevel = 2,
  href,
  projectId,
  bookmarked,
  bookmarkReturnPath,
  children,
}: ProjectListCardProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS);
  const remainingTagCount = tags.length - visibleTags.length;

  return (
    <article className="grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-10">
      <div className="min-w-0">
        {contextItems.length > 0 ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
            {contextItems.map((item, index) =>
              item.dateTime ? (
                <time key={`${item.label}-${index}`} dateTime={item.dateTime}>
                  {item.label}
                </time>
              ) : (
                <span key={`${item.label}-${index}`}>{item.label}</span>
              ),
            )}
          </div>
        ) : null}

        <Heading className="font-display mt-3 text-pretty break-keep text-2xl font-semibold tracking-[-0.02em] text-slate-950 [overflow-wrap:anywhere]">
          {href ? (
            <Link
              href={href}
              className="decoration-brand-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              {title}
            </Link>
          ) : (
            title
          )}
        </Heading>
        <p className="mt-3 line-clamp-3 max-w-3xl text-pretty break-keep text-sm leading-7 text-slate-600 [overflow-wrap:anywhere]">
          {summary}
        </p>

        {visibleTags.length > 0 ? (
          <ul
            className="mt-5 flex flex-wrap gap-x-3 gap-y-2 text-xs text-slate-600"
            aria-label={`${title} 태그: ${tags.join(", ")}`}
          >
            {visibleTags.map((tag) => (
              <li key={tag} className="border-b border-brand-accent pb-0.5">
                {tag}
              </li>
            ))}
            {remainingTagCount > 0 ? (
              <li className="text-slate-500">외 {remainingTagCount}개</li>
            ) : null}
          </ul>
        ) : null}

        {facts.length > 0 ? (
          <dl className="mt-6 grid gap-x-7 gap-y-5 text-sm sm:grid-cols-2 xl:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-xs text-slate-500">{fact.label}</dt>
                <dd className="mt-1 font-bold text-slate-800">{fact.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {children ? (
          <div className="mt-7 border-t border-slate-200 pt-6">{children}</div>
        ) : null}

        {stats.length > 0 ? (
          <ul
            className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-200 pt-4 text-xs tabular-nums text-slate-500"
            aria-label={`${title} 통계`}
          >
            {stats.map((stat) => (
              <li key={stat.label}>
                {stat.label} {stat.value.toLocaleString("ko-KR")}
              </li>
            ))}
          </ul>
        ) : null}

        {href ? (
          <Link
            href={href}
            className="mt-5 inline-flex min-h-10 items-center border-b-2 border-brand-accent px-1 text-sm font-bold text-brand hover:border-brand hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          >
            프로젝트 기록 보기
            <span className="sr-only">: {title}</span>
          </Link>
        ) : null}
      </div>

      <aside className="border-t border-slate-200 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-7">
        <div className="relative mb-5 aspect-[16/10] overflow-hidden bg-brand-canvas">
          {representativeImage ? (
            <Image
              src={representativeImage.src}
              alt={representativeImage.alt}
              fill
              unoptimized
              sizes="240px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-xs leading-5 text-slate-500">
              대표 이미지 미등록
            </div>
          )}
        </div>

        {showInformationCompleteness ? (
          <ProjectInformationCompleteness
            projectName={title}
            score={informationCompletenessScore}
          />
        ) : null}

        {projectId && bookmarkReturnPath && bookmarked !== undefined ? (
          <div className="mt-5 border-t border-slate-200 pt-4">
            <ProjectBookmarkButton
              projectId={projectId}
              projectName={title}
              initialBookmarked={bookmarked}
              returnPath={bookmarkReturnPath}
            />
          </div>
        ) : null}

        {registrantName ? (
          <dl className={`${showInformationCompleteness ? "mt-5 border-t pt-4" : ""} border-slate-200 text-sm`}>
            <dt className="text-xs text-slate-500">{registrantLabel}</dt>
            <dd className="mt-1 truncate font-medium text-slate-800">
              {registrantName}
            </dd>
          </dl>
        ) : null}
      </aside>
    </article>
  );
}

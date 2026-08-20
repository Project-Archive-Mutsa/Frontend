import type { ProjectDiscoveryResultItem as ProjectDiscoveryResultItemType } from "@/features/project-discovery/types";
import Link from "next/link";
import {
  getProjectActivityStatusLabel,
  getProjectPurposeLabel,
  getProjectResultLevelLabel,
} from "@/shared/project-summary/types";

interface ProjectDiscoveryResultItemProps {
  item: ProjectDiscoveryResultItemType;
  query: string;
}

const targetLabels = {
  PROJECT: "프로젝트",
  CONTEST: "공모전",
  IDEA: "아이디어",
  AWARD: "수상작",
} as const;

function getAssetSummary(item: ProjectDiscoveryResultItemType) {
  if (item.assetCount === null || item.assetCount === undefined) return "연동 전";
  const categories = item.assetCategories?.slice(0, 2).join(" · ");
  return categories ? `${item.assetCount}개 · ${categories}` : `${item.assetCount}개`;
}

function getAwardSummary(item: ProjectDiscoveryResultItemType) {
  if (item.awards === undefined) return "연동 전";
  return item.awards.length > 0
    ? item.awards.slice(0, 2).map((award) => award.title).join(", ")
    : "없음";
}

export default function ProjectDiscoveryResultItem({
  item,
  query,
}: ProjectDiscoveryResultItemProps) {
  const similarityPercent = Math.min(
    100,
    Math.max(0, Math.round(item.similarityScore * 1000) / 10),
  );
  const eventYear = item.eventDate?.slice(0, 4);
  const contextItems = [
    getProjectPurposeLabel(item.registrationPurpose) ?? targetLabels[item.type],
    item.eventName
      ? `${item.eventName}${eventYear ? ` · ${eventYear}년 출품` : ""}`
      : item.category,
  ];
  const tags = [...new Set([item.category, ...item.tags].filter(Boolean))];
  const facts = [
    {
      label: "결과물 단계",
      value: getProjectResultLevelLabel(item.resultLevel),
    },
    {
      label: "현재 활동 상태",
      value: getProjectActivityStatusLabel(item.activityStatus),
    },
    { label: "보유 자산", value: getAssetSummary(item) },
    { label: "수상 이력", value: getAwardSummary(item) },
  ];
  const comparisons = [
    { label: "유사한 이유", items: item.similarityReasons },
    { label: "주요 차이점", items: item.differences },
    { label: "추가 검증 과제", items: item.validationSuggestions },
  ];

  return (
    <article className="grid gap-6 py-8 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-8">
      <div className="lg:border-r lg:border-slate-200 lg:pr-8">
        <p className="text-xs font-bold text-slate-600">검색어와 유사도</p>
        <strong className="mt-2 block text-4xl font-bold tracking-[-0.05em] tabular-nums text-brand">
          {similarityPercent}%
        </strong>
        <div
          role="meter"
          aria-label={`검색어 ${query}. ${item.title} 유사도`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={similarityPercent}
          className="mt-4 h-2 overflow-hidden bg-slate-200"
        >
          <div
            className="h-full bg-brand-accent"
            style={{ width: `${similarityPercent}%` }}
          />
        </div>
        <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500 [overflow-wrap:anywhere]">
          &ldquo;{query}&rdquo; 기준
        </p>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
          {contextItems.map((context) => (
            <span key={context}>{context}</span>
          ))}
        </div>
        <h3 className="font-display mt-3 text-pretty break-keep text-2xl font-semibold tracking-[-0.02em] text-slate-950 [overflow-wrap:anywhere]">
          {item.type === "PROJECT" ? (
            <Link
              href={`/projects/${item.id}`}
              className="decoration-brand-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              {item.title}
            </Link>
          ) : (
            item.title
          )}
        </h3>
        <p className="mt-3 max-w-3xl text-pretty break-keep text-sm leading-7 text-slate-600 [overflow-wrap:anywhere]">
          {item.description}
        </p>

        <ul
          aria-label={`${item.title} 태그: ${tags.join(", ")}`}
          className="mt-5 flex flex-wrap gap-x-3 gap-y-2 text-xs text-slate-600"
        >
          {tags.map((tag) => (
            <li key={tag} className="border-b border-brand-accent pb-0.5">
              {tag}
            </li>
          ))}
        </ul>

        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4 text-sm">
          {facts.map((fact) => (
            <div key={fact.label} className="min-w-28">
              <dt className="text-xs text-slate-500">{fact.label}</dt>
              <dd className="mt-1 font-bold text-slate-800">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-7 grid gap-6 border-t border-slate-200 pt-6 md:grid-cols-3">
          {comparisons.map((comparison) => (
            <section key={comparison.label} aria-label={comparison.label}>
              <h4 className="text-sm font-bold text-slate-900">
                {comparison.label}
              </h4>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                {(comparison.items?.length
                  ? comparison.items
                  : ["제공된 분석 없음"])
                  .slice(0, 2)
                  .map((value) => (
                    <li key={value} className="flex gap-2">
                      <span aria-hidden="true" className="text-brand">
                        —
                      </span>
                      <span>{value}</span>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>

        {item.type === "PROJECT" ? (
          <Link
            href={`/projects/${item.id}`}
            className="mt-6 inline-flex min-h-10 items-center border-b-2 border-brand-accent px-1 text-sm font-bold text-brand hover:border-brand hover:text-brand-hover"
          >
            프로젝트 기록 보기
          </Link>
        ) : null}
      </div>
    </article>
  );
}

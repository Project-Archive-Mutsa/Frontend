import type { ProjectDiscoveryResultsData } from "@/features/project-discovery/types";

interface ProjectDiscoverySummaryProps {
  data: ProjectDiscoveryResultsData;
}

export default function ProjectDiscoverySummary({
  data,
}: ProjectDiscoverySummaryProps) {
  const resultCounts = [
    { label: "프로젝트", value: data.projects.length },
    { label: "공모전", value: data.contests.length },
    { label: "아이디어", value: data.ideas.length },
    { label: "수상작", value: data.awards.length },
  ];
  const totalCount = resultCounts.reduce((total, item) => total + item.value, 0);

  return (
    <section
      aria-labelledby="project-discovery-summary-title"
      className="border-y border-slate-300"
    >
      <header className="flex flex-wrap items-end justify-between gap-4 py-6 sm:py-8">
        <div className="min-w-0">
          <h2
            id="project-discovery-summary-title"
            className="text-balance break-keep text-2xl font-bold tracking-[-0.035em] text-slate-950 sm:text-3xl"
          >
            &ldquo;{data.query}&rdquo;와 관련된 사례
          </h2>
        </div>
        <p className="shrink-0 text-sm font-semibold text-slate-700">
          총 {totalCount.toLocaleString("ko-KR")}건
        </p>
      </header>

      {data.matchedCategories.length > 0 ? (
        <ul
          aria-label="관련 카테고리"
          className="flex flex-wrap gap-x-3 gap-y-2 border-t border-slate-200 py-4 text-xs text-slate-600"
        >
          {data.matchedCategories.map((category) => (
            <li key={category} className="border-b border-brand-accent pb-0.5">
              {category}
            </li>
          ))}
        </ul>
      ) : null}

      <dl className="grid border-t border-slate-200 sm:grid-cols-4">
        {resultCounts.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between border-b border-slate-200 py-4 last:border-b-0 sm:block sm:border-r sm:border-b-0 sm:px-6 sm:last:border-r-0"
          >
            <dt className="text-sm text-slate-600">{item.label}</dt>
            <dd className="text-xl font-bold tabular-nums text-slate-900 sm:mt-1 sm:text-2xl">
              {item.value.toLocaleString("ko-KR")}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

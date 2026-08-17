import type { ProjectDiscoveryResultsData } from "@/features/project-discovery/types";
import { projectDiscoveryAiSummaryMock } from "@/mocks/project-discovery/ai-summary";

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
      className="border border-brand-soft bg-white"
    >
      <header className="border-b border-brand-soft px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-brand-accent">
              AI 검색 요약
            </p>
            <h1
              id="project-discovery-summary-title"
              className="mt-2 text-balance break-keep text-2xl font-bold tracking-[-0.035em] text-[#102a43] sm:text-3xl"
            >
              &ldquo;{data.query}&rdquo; 검색 결과
            </h1>
            <p className="mt-3 max-w-3xl text-pretty break-keep text-sm leading-7 text-[#5f7488] sm:text-base">
              {projectDiscoveryAiSummaryMock.overview}
            </p>
          </div>
          <p className="shrink-0 text-sm font-semibold text-[#315978]">
            총 {totalCount.toLocaleString("ko-KR")}건
          </p>
        </div>

        {data.matchedCategories.length > 0 ? (
          <ul
            aria-label="관련 카테고리"
            className="mt-5 flex flex-wrap gap-x-3 gap-y-2 text-xs text-[#526f88]"
          >
            {data.matchedCategories.map((category) => (
              <li key={category} className="border-b border-[#aac3d6] pb-0.5">
                {category}
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      <dl className="grid border-b border-brand-soft sm:grid-cols-4">
        {resultCounts.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between border-b border-brand-soft px-5 py-4 last:border-b-0 sm:block sm:border-r sm:border-b-0 sm:px-8 sm:last:border-r-0"
          >
            <dt className="text-sm text-[#62798d]">{item.label}</dt>
            <dd className="mt-0 text-xl font-bold tabular-nums text-[#173f68] sm:mt-1 sm:text-2xl">
              {item.value.toLocaleString("ko-KR")}
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid lg:grid-cols-2">
        <article className="border-b border-brand-soft px-5 py-6 sm:px-8 sm:py-8 lg:border-r lg:border-b-0">
          <h2 className="text-lg font-bold text-[#173f68]">결과를 비교할 때 볼 점</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[#5f7488]">
            {projectDiscoveryAiSummaryMock.commonPatterns.map((pattern) => (
              <li key={pattern} className="flex gap-3">
                <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-brand-accent" />
                <span>{pattern}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="px-5 py-6 sm:px-8 sm:py-8">
          <h2 className="text-lg font-bold text-[#173f68]">추가로 검증할 점</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[#5f7488]">
            {projectDiscoveryAiSummaryMock.reviewPoints.map((point) => (
              <li key={point} className="flex gap-3">
                <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-brand-accent" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <p className="border-t border-brand-soft bg-brand-canvas px-5 py-5 text-sm leading-7 text-[#536b80] sm:px-8">
        {projectDiscoveryAiSummaryMock.conclusion}
      </p>
    </section>
  );
}

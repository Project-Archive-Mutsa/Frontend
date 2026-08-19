import type {
  ProjectDiscoveryAnalysisSummary,
  ProjectDiscoveryResultItem,
} from "@/features/project-discovery/types";

interface ProjectDiscoverySummaryProps {
  query: string;
  analysis: ProjectDiscoveryAnalysisSummary;
  projects: readonly ProjectDiscoveryResultItem[];
}

export default function ProjectDiscoverySummary({
  query,
  analysis,
  projects,
}: ProjectDiscoverySummaryProps) {
  const resultMetrics = [
    { label: "검색 결과", value: projects.length },
    {
      label: "유사도 80% 이상",
      value: projects.filter((project) => project.similarityScore >= 0.8).length,
    },
    {
      label: "공개 계승",
      value: projects.filter(
        (project) => project.registrationPurpose === "ZOMBIE",
      ).length,
    },
    {
      label: "수상 이력",
      value: projects.filter((project) => (project.awards?.length ?? 0) > 0)
        .length,
    },
  ];
  const analysisSections = [
    {
      id: "project-discovery-comparison-points",
      title: "결과를 비교할 때 볼 점",
      items: analysis.comparisonPoints,
    },
    {
      id: "project-discovery-validation-points",
      title: "추가로 검증할 점",
      items: analysis.validationPoints,
    },
  ];

  return (
    <section
      aria-labelledby="project-discovery-summary-title"
      className="border-y border-slate-300 bg-white"
    >
      <header className="px-5 py-7 sm:px-7 sm:py-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-bold text-brand">AI 검색 요약</p>
            <h2
              id="project-discovery-summary-title"
              className="font-display mt-2 text-balance break-keep text-2xl font-bold tracking-[-0.025em] text-slate-950 sm:text-3xl"
            >
              &ldquo;{query}&rdquo; 분석 결과
            </h2>
          </div>
          <p className="shrink-0 text-sm font-semibold tabular-nums text-slate-700">
            유사 프로젝트 {projects.length.toLocaleString("ko-KR")}개
          </p>
        </div>

        <p className="mt-5 max-w-4xl text-pretty break-keep text-base leading-8 text-slate-700">
          {analysis.summary}
        </p>

        <ul
          aria-label="AI 분석 키워드"
          className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-slate-600"
        >
          {analysis.keywords.map((keyword) => (
            <li key={keyword} className="border-b border-brand-accent pb-0.5">
              {keyword}
            </li>
          ))}
        </ul>
      </header>

      <dl
        aria-label="검색 결과 구성"
        className="grid border-t border-slate-200 sm:grid-cols-2 lg:grid-cols-4"
      >
        {resultMetrics.map((metric, index) => (
          <div
            key={metric.label}
            className={`px-5 py-5 sm:px-7 ${
              index < resultMetrics.length - 1
                ? "border-b border-slate-200"
                : ""
            } ${index % 2 === 0 ? "sm:border-r" : "sm:border-r-0"} ${
              index < 2 ? "sm:border-b" : "sm:border-b-0"
            } ${index < 3 ? "lg:border-r" : "lg:border-r-0"} lg:border-b-0`}
          >
            <dt className="text-sm text-slate-500">{metric.label}</dt>
            <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-950">
              {metric.value.toLocaleString("ko-KR")}개
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid border-t border-slate-200 lg:grid-cols-2">
        {analysisSections.map((section, index) => (
          <section
            key={section.id}
            aria-labelledby={section.id}
            className={`px-5 py-7 sm:px-7 sm:py-8 ${
              index === 0
                ? "border-b border-slate-200 lg:border-r lg:border-b-0"
                : ""
            }`}
          >
            <h3
              id={section.id}
              className="font-display text-xl font-semibold tracking-[-0.02em] text-slate-950"
            >
              {section.title}
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
              {section.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="text-brand">
                    —
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="border-t border-slate-200 bg-slate-100 px-5 py-5 text-sm leading-7 text-slate-600 sm:px-7">
        <strong className="mr-2 font-bold text-slate-900">해석 기준</strong>
        {analysis.interpretationNote}
      </p>
      <p className="border-t border-slate-200 px-5 py-4 text-xs leading-5 text-slate-500 sm:px-7">
        <strong className="mr-2 font-bold text-slate-700">데모 데이터</strong>
        AI 분석 백엔드 개발 중이며, 현재는 결과 구조와 사용 흐름을 확인하기 위한 예시를 표시합니다.
      </p>
    </section>
  );
}

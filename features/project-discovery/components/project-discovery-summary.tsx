import type {
  ProjectDiscoveryAnalysisStatus,
  ProjectDiscoveryAnalysisSummary,
  ProjectDiscoveryResultItem,
} from "@/features/project-discovery/types";

interface ProjectDiscoveryResultCounts {
  projects: number;
  contests: number;
  ideas: number;
  awards: number;
}

interface ProjectDiscoverySummaryProps {
  query: string;
  analysis: ProjectDiscoveryAnalysisSummary | null;
  analysisStatus: ProjectDiscoveryAnalysisStatus;
  matchedCategories: readonly string[];
  projects: readonly ProjectDiscoveryResultItem[];
  resultCounts: ProjectDiscoveryResultCounts;
}

const analysisStatusLabels: Record<ProjectDiscoveryAnalysisStatus, string> = {
  PENDING: "AI 분석 대기 중",
  SUCCEEDED: "AI 분석 완료",
  PARTIAL: "일부 분석 완료",
  FAILED: "AI 분석 실패",
};

const analysisStatusMessages: Record<
  Exclude<ProjectDiscoveryAnalysisStatus, "SUCCEEDED">,
  string
> = {
  PENDING:
    "검색 후보는 확인했지만 AI 비교 분석은 아직 처리 중입니다. 아래 프로젝트 목록을 먼저 확인할 수 있습니다.",
  PARTIAL:
    "일부 검색 대상이나 분석 단계가 완료되지 않아 현재 제공된 결과만 표시합니다.",
  FAILED:
    "AI 종합 분석을 제공하지 못했습니다. 검색된 프로젝트 후보는 아래 목록에서 확인할 수 있습니다.",
};

export default function ProjectDiscoverySummary({
  query,
  analysis,
  analysisStatus,
  matchedCategories,
  projects,
  resultCounts,
}: ProjectDiscoverySummaryProps) {
  const totalCount = Object.values(resultCounts).reduce(
    (sum, count) => sum + count,
    0,
  );
  const analysisKeywords = analysis?.keywords.length
    ? analysis.keywords
    : matchedCategories;
  const resultMetrics = [
    { label: "프로젝트", value: resultCounts.projects },
    { label: "공모전", value: resultCounts.contests },
    { label: "아이디어", value: resultCounts.ideas },
    { label: "수상작", value: resultCounts.awards },
  ];
  const analysisSections = analysis
    ? [
        {
          id: "project-discovery-comparison-points",
          title: "반복해서 발견된 공통점",
          items: analysis.comparisonPoints,
        },
        {
          id: "project-discovery-validation-points",
          title: "차별화 가능성이 높은 지점",
          items: analysis.validationPoints,
        },
      ].filter((section) => section.items.length > 0)
    : [];
  const partialMetadataCount = projects.filter(
    (project) => project.metadataStatus === "PARTIAL",
  ).length;
  const statusMessage =
    analysisStatus === "SUCCEEDED"
      ? null
      : analysisStatusMessages[analysisStatus];

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
          <div className="shrink-0 text-right text-sm font-semibold text-slate-700">
            <p role="status">{analysisStatusLabels[analysisStatus]}</p>
            <p className="mt-1 tabular-nums">
              총 {totalCount.toLocaleString("ko-KR")}건
            </p>
          </div>
        </div>

        {analysis ? (
          <p className="mt-5 max-w-4xl text-pretty break-keep text-base leading-8 text-slate-700">
            {analysis.summary}
          </p>
        ) : (
          <p className="mt-5 max-w-4xl text-pretty break-keep text-base leading-8 text-slate-700">
            {statusMessage ??
              "AI 분석 요약이 응답에 포함되지 않았습니다. 아래 프로젝트 목록을 확인해 주세요."}
          </p>
        )}

        {analysisKeywords.length > 0 ? (
          <ul
            aria-label="AI 분석 키워드"
            className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-slate-600"
          >
            {analysisKeywords.map((keyword) => (
              <li key={keyword} className="border-b border-brand-accent pb-0.5">
                {keyword}
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      <dl
        aria-label="AI 검색 결과 구성"
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

      {analysisSections.length > 0 ? (
        <div className="grid border-t border-slate-200 lg:grid-cols-2">
          {analysisSections.map((section, index) => (
            <section
              key={section.id}
              aria-labelledby={section.id}
              className={`px-5 py-7 sm:px-7 sm:py-8 ${
                index === 0 && analysisSections.length > 1
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
      ) : null}

      <p className="border-t border-slate-200 bg-slate-100 px-5 py-5 text-sm leading-7 text-slate-600 sm:px-7">
        <strong className="mr-2 font-bold text-slate-900">해석 기준</strong>
        {analysis?.interpretationNote ||
          "유사도는 아이디어의 우수성, 성공 가능성 또는 구매 적합성을 보장하지 않습니다."}
      </p>

      {statusMessage && analysis ? (
        <p className="border-t border-slate-200 px-5 py-4 text-xs leading-5 text-slate-600 sm:px-7">
          <strong className="mr-2 font-bold text-slate-900">
            {analysisStatusLabels[analysisStatus]}
          </strong>
          {statusMessage}
        </p>
      ) : null}

      {partialMetadataCount > 0 ? (
        <p className="border-t border-slate-200 px-5 py-4 text-xs leading-5 text-slate-600 sm:px-7">
          <strong className="mr-2 font-bold text-slate-900">
            프로젝트 정보 일부 미반영
          </strong>
          {partialMetadataCount.toLocaleString("ko-KR")}개 프로젝트의 공통
          메타데이터를 불러오지 못해 AI 검색 응답만 표시합니다.
        </p>
      ) : null}
    </section>
  );
}

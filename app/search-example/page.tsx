type SearchTarget = "PROJECT" | "CONTEST" | "IDEA" | "AWARD";

type ProjectType = "PROJECT";

type ProjectCategory = "POPULAR" | "ZOMBIE" | "AWARD" | "GENERAL";

interface SearchProject {
  type: ProjectType;
  id: number;
  title: string;
  description: string;
  category: ProjectCategory;
  tags: readonly string[];
  representativeImageUrl: string;
  detailPath: string;
  similarityScore: number;
}

interface SearchResultData {
  query: string;
  matchedCategories: readonly string[];
  targets: readonly SearchTarget[];
  projects: readonly SearchProject[];
}

interface SearchResponse {
  success: boolean;
  data: SearchResultData;
}

const naturalLanguageQuery =
  "소상공인이 업종과 광고 예산만 입력하면 AI가 채널별 광고를 만들고, 성과까지 관리해 주는 서비스를 만들려 하는데 비슷한 프로젝트가 있었어?";

const searchResponse: SearchResponse = {
  success: true,
  data: {
    query: "AI 광고 관리 서비스",
    matchedCategories: ["AI·인공지능", "마케팅·광고", "비즈니스 모델"],
    targets: ["PROJECT", "CONTEST", "IDEA", "AWARD"],
    projects: [
      {
        type: "PROJECT",
        id: 4,
        title: "소상공인 광고 코치",
        description:
          "소상공인의 업종과 예산을 입력하면 AI가 광고 문구, 타깃, 채널 전략을 추천하는 서비스입니다.",
        category: "POPULAR",
        tags: ["AI", "광고", "소상공인"],
        representativeImageUrl:
          "https://attcpbgmbomcmybhsxuh.supabase.co/storage/v1/object/public/project-archive-assets/projects/4/thumbnail.svg",
        detailPath: "/projects/4",
        similarityScore: 0.5861,
      },
      {
        type: "PROJECT",
        id: 41,
        title: "소상공인 매출 회복 위험 예측 보안 점검판",
        description:
          "매출, 리뷰, 재고, 광고비를 연결해 작은 매장의 개선 액션과 캠페인 후보를 제안합니다. 위험 신호와 권한, 공개 범위, 민감 정보 처리 항목까지 함께 점검합니다.",
        category: "AWARD",
        tags: ["소상공인", "매출", "리뷰", "예측", "보안"],
        representativeImageUrl:
          "https://attcpbgmbomcmybhsxuh.supabase.co/storage/v1/object/public/project-archive-assets/projects/41/thumbnail.svg",
        detailPath: "/projects/41",
        similarityScore: 0.3728,
      },
      {
        type: "PROJECT",
        id: 2061,
        title: "청년 창업 검증 위험 예측 모바일 프로토타입",
        description:
          "아이디어, 타깃 고객, 가격 가설, 인터뷰 결과를 묶어 시장 검증 리포트를 만듭니다. 모바일 화면 흐름과 API 명세는 남아 있지만 운영 자동화와 배포 문서는 미완성입니다.",
        category: "ZOMBIE",
        tags: ["창업", "MVP", "예측", "모바일", "인수인계"],
        representativeImageUrl:
          "https://attcpbgmbomcmybhsxuh.supabase.co/storage/v1/object/public/project-archive-assets/projects/2061/thumbnail.svg",
        detailPath: "/projects/2061",
        similarityScore: 0.3532,
      },
      {
        type: "PROJECT",
        id: 119,
        title: "초보 운전 훈련 위험 예측 시장 검증 키트",
        description:
          "주차, 차선 변경, 골목 주행 기록을 분석해 반복 실수와 연습 루틴을 제안합니다. 사용자 인터뷰, 가격 가설, 경쟁 서비스 비교표를 포함한 시장 검증형 프로젝트입니다.",
        category: "GENERAL",
        tags: ["사용자 분석", "추천", "시장 검증", "리포트"],
        representativeImageUrl:
          "https://attcpbgmbomcmybhsxuh.supabase.co/storage/v1/object/public/project-archive-assets/projects/119/thumbnail.svg",
        detailPath: "/projects/119",
        similarityScore: 0.3186,
      },
    ],
  },
};

const summaryMetrics = [
  {
    label: "유사 사례",
    value: "18건",
    description: "설명과 태그 기준 후보",
  },
  {
    label: "수상·선정",
    value: "3건",
    description: "공모전·해커톤 기록 포함",
  },
  {
    label: "후속 개발 후보",
    value: "4건",
    description: "중단 또는 인수인계 가능",
  },
];

const commonPatterns = [
  "소상공인의 제한된 광고 예산과 운영 인력을 핵심 문제로 정의했습니다.",
  "AI로 문구·타깃·채널을 추천해 광고 준비 시간을 줄이는 접근이 반복됩니다.",
  "매출, 리뷰, 광고비처럼 이미 쌓이는 데이터를 행동 제안으로 연결합니다.",
];

const differentiationPoints = [
  "기존 사례는 대부분 ‘광고 생성’ 또는 ‘진단 리포트’에서 끝납니다.",
  "채널별 성과를 다시 학습해 예산을 재배분하는 운영 루프는 상대적으로 드뭅니다.",
  "추천 근거와 예상 효과를 설명하면 AI 결과에 대한 점주의 신뢰를 차별화할 수 있습니다.",
];

const targetLabels: Record<SearchTarget, string> = {
  PROJECT: "프로젝트",
  CONTEST: "공모전",
  IDEA: "아이디어",
  AWARD: "수상작",
};

const categoryLabels: Record<ProjectCategory, string> = {
  POPULAR: "인기 프로젝트",
  ZOMBIE: "중단 프로젝트",
  AWARD: "수상작",
  GENERAL: "등록 프로젝트",
};

const categoryStyles: Record<ProjectCategory, string> = {
  POPULAR: "border-[#c7dff1] bg-[#edf7ff] text-[#216498]",
  ZOMBIE: "border-[#e7d8a9] bg-[#fff9e8] text-[#8a651f]",
  AWARD: "border-[#ead69d] bg-[#fff5d8] text-[#906315]",
  GENERAL: "border-[#d9e1e8] bg-[#f5f7f9] text-[#5e7182]",
};

export default function SearchExamplePage() {
  const { data } = searchResponse;

  return (
    <main
      data-search-status={searchResponse.success ? "success" : "error"}
      className="min-h-screen overflow-hidden bg-[#f6faff] text-[#102a43]"
    >
      <section className="border-b border-[#dce8f4] bg-white">
        <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-12 lg:px-10">
          <form
            action="/search-example"
            className="rounded-[1.6rem] border border-[#d5e5f2] bg-white p-2 shadow-[0_22px_60px_-38px_rgba(21,72,119,0.7)] sm:flex sm:items-center"
          >
            <label className="flex min-w-0 flex-1 items-start gap-3 px-4 py-3 sm:items-center sm:px-5">
              <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e9f4ff] text-[#1d629f] sm:mt-0">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.8-3.8" />
                </svg>
              </span>
              <span className="sr-only">AI 프로젝트 검색</span>
              <input
                type="search"
                name="q"
                defaultValue={naturalLanguageQuery}
                className="min-w-0 flex-1 bg-transparent py-1 text-sm leading-6 font-medium text-[#24435f] outline-none placeholder:text-[#8093a6] sm:text-base"
              />
            </label>
            <button
              type="submit"
              className="flex w-full shrink-0 items-center justify-center gap-2 rounded-[1.15rem] bg-[#174f87] px-6 py-4 text-sm font-bold text-white shadow-[0_12px_28px_-14px_rgba(23,79,135,0.9)] transition hover:bg-[#0f426f] focus-visible:ring-2 focus-visible:ring-[#317bb8] focus-visible:ring-offset-2 sm:w-auto"
            >
              <span className="rounded-full bg-[#8ed2ff] px-2 py-0.5 text-[9px] tracking-[0.12em] text-[#123b67]">
                AI
              </span>
              검색
            </button>
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-18 lg:px-10 lg:py-22">
        <section aria-labelledby="ai-summary-title">
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-[#123f70] p-[1px] shadow-[0_30px_80px_-44px_rgba(13,55,98,0.9)]">
            <div
              aria-hidden="true"
              className="absolute -top-44 -right-28 size-96 rounded-full bg-[#3193d1]/35 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-48 -left-24 size-80 rounded-full bg-[#78c7f2]/20 blur-3xl"
            />

            <div className="relative overflow-hidden rounded-[calc(2rem-1px)] bg-[linear-gradient(145deg,#113d6d_0%,#164f86_58%,#123f70_100%)] text-white">
              <div className="border-b border-white/12 px-6 py-7 sm:px-9 sm:py-9 lg:px-11">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#9ed9ff] px-2.5 py-1 text-[10px] font-extrabold tracking-[0.12em] text-[#123d68]">
                        AI
                      </span>
                      <span className="text-xs font-bold tracking-[0.14em] text-[#b9ddf6] uppercase">
                        Free Insight
                      </span>
                    </div>
                    <h1
                      id="ai-summary-title"
                      className="mt-4 text-2xl font-bold tracking-[-0.04em] sm:text-3xl"
                    >
                      AI 검색 결과 요약
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-[#d7eaf8] sm:text-base">
                      총 18건의 후보를 비교한 결과, 상위 사례는 광고 제작 자동화와
                      소상공인 의사결정 지원에 집중되어 있습니다. 아직 비어 있는
                      지점은 추천 이후의 집행과 성과 개선을 연결하는 운영 흐름입니다.
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/18 bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#e1f1fb]">
                        검색어 · {data.query}
                      </span>
                      {data.matchedCategories.map((category) => (
                        <span
                          key={category}
                          className="rounded-full border border-[#83bde3]/35 bg-[#76b9e5]/12 px-3 py-1.5 text-xs font-semibold text-[#c8e6f8]"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 text-xs leading-5 text-[#b6d5e9]">
                      검색 범위 · {data.targets.map((target) => targetLabels[target]).join(" · ")}
                    </p>
                  </div>
                  <span className="w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#d9edfb]">
                    분석 기준 · 설명 / 태그 / 상태 / 수상 기록
                  </span>
                </div>
              </div>

              <dl className="grid border-b border-white/12 sm:grid-cols-3">
                {summaryMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="border-b border-white/12 px-6 py-6 last:border-0 sm:border-r sm:border-b-0 sm:px-9 sm:last:border-r-0"
                  >
                    <dt className="text-xs font-semibold text-[#a9d0eb]">
                      {metric.label}
                    </dt>
                    <dd className="mt-2 text-3xl font-bold tracking-[-0.04em]">
                      {metric.value}
                    </dd>
                    <p className="mt-1 text-xs text-[#b9d4e8]">
                      {metric.description}
                    </p>
                  </div>
                ))}
              </dl>

              <div className="grid gap-8 px-6 py-8 sm:px-9 sm:py-10 lg:grid-cols-2 lg:px-11">
                <article>
                  <p className="text-xs font-bold tracking-[0.14em] text-[#8ed2ff] uppercase">
                    Common Pattern
                  </p>
                  <h3 className="mt-2 text-lg font-bold">반복해서 발견된 공통점</h3>
                  <ul className="mt-5 space-y-4">
                    {commonPatterns.map((pattern) => (
                      <li key={pattern} className="flex gap-3 text-sm leading-6 text-[#d9e9f5]">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#88d0ff]" />
                        {pattern}
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="rounded-2xl border border-[#91c8ed]/30 bg-white/8 p-6 backdrop-blur-sm">
                  <p className="text-xs font-bold tracking-[0.14em] text-[#a9ddff] uppercase">
                    Opportunity
                  </p>
                  <h3 className="mt-2 text-lg font-bold">차별화 가능성이 높은 지점</h3>
                  <ul className="mt-5 space-y-4">
                    {differentiationPoints.map((point) => (
                      <li key={point} className="flex gap-3 text-sm leading-6 text-[#e2f0fa]">
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 20 20"
                          className="mt-0.5 size-5 shrink-0 text-[#8ed2ff]"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="m4 10 4 4 8-8" />
                        </svg>
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              </div>

              <div className="border-t border-white/12 bg-[#0d355f]/38 px-6 py-8 sm:px-9 sm:py-10 lg:px-11">
                <div className="max-w-4xl">
                  <p className="text-xs font-bold tracking-[0.14em] text-[#8ed2ff] uppercase">
                    Result Summary
                  </p>
                  <h3 className="mt-2 text-xl font-bold">검색 결과를 종합하면</h3>
                  <p className="mt-4 text-sm leading-7 text-[#c7ddec] sm:text-base">
                    AI를 활용해 소상공인의 광고 문구와 채널을 추천하는 아이디어는
                    이미 여러 프로젝트에서 확인됩니다. 다만 기존 사례는 대부분
                    광고를 만드는 단계나 단발성 진단에서 끝나고, 집행 결과를 다시
                    분석해 다음 행동으로 연결하는 흐름은 상대적으로 부족했습니다.
                  </p>
                  <p className="mt-5 rounded-2xl border border-[#8dc7ec]/25 bg-white/8 px-5 py-4 text-sm leading-7 font-medium text-[#e4f2fb] sm:px-6 sm:text-base">
                    따라서 이 프로젝트는 광고 생성 기능을 넓게 구현하기보다, 한
                    업종을 대상으로 여러 채널의 성과를 한눈에 비교하고 결과에 따라
                    예산 조정과 다음 캠페인 행동을 제안하는 방향으로 구현하면 좋을
                    것 같습니다. 추천 이유와 예상 효과까지 함께 보여주면 기존
                    사례와 더 분명하게 구분될 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 flex items-start gap-2 px-2 text-xs leading-5 text-[#71879b]">
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="mt-0.5 size-4 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <circle cx="10" cy="10" r="7" />
              <path d="M10 9v5M10 6.5h.01" />
            </svg>
            이 요약은 검색된 프로젝트의 공개 설명과 태그를 바탕으로 생성한 추정입니다.
            프로젝트의 성과, 소유권, 라이선스 또는 사업 성공을 보증하지 않습니다.
          </p>
        </section>

        <section aria-labelledby="similar-projects-title" className="mt-20 sm:mt-24">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.17em] text-[#4b85ba] uppercase">
                Similar Archives
              </p>
              <h2
                id="similar-projects-title"
                className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#102a43] sm:text-4xl"
              >
                검색된 유사 프로젝트
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#687f94]">
                무료 요약에 사용된 상위 프로젝트입니다. 상세 자료와 분석 근거는
                결제 후 확인할 수 있습니다.
              </p>
            </div>
            <button
              type="button"
              aria-describedby="payment-example-note"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#174f87] px-5 py-3 text-sm font-bold text-white shadow-[0_14px_30px_-16px_rgba(23,79,135,0.9)] outline-none transition hover:bg-[#0f426f] focus-visible:ring-2 focus-visible:ring-[#317bb8] focus-visible:ring-offset-4"
            >
              상위 10건 전체 보기
              <span className="text-[#9ed9ff]">6,000원</span>
            </button>
          </div>

          <ol className="space-y-4">
            {data.projects.map((project, index) => {
              const similarityPercent = Math.round(project.similarityScore * 1000) / 10;

              return (
                <li key={project.id}>
                  <article className="group grid overflow-hidden rounded-2xl border border-[#d8e5ef] bg-white shadow-[0_18px_45px_-36px_rgba(20,62,100,0.7)] transition duration-300 hover:-translate-y-0.5 hover:border-[#b8d1e4] hover:shadow-[0_24px_55px_-34px_rgba(20,62,100,0.62)] md:grid-cols-[12rem_minmax(0,1fr)] lg:grid-cols-[12rem_minmax(0,1fr)_12rem]">
                    <div
                      role="img"
                      aria-label={`${project.title} 대표 이미지`}
                      className="relative min-h-44 bg-[#e8f2f8] bg-cover bg-center md:min-h-full"
                      style={{
                        backgroundImage: `linear-gradient(135deg, rgba(237,247,253,0.28), rgba(196,221,238,0.38)), url(${project.representativeImageUrl})`,
                      }}
                    >
                      <span className="absolute top-4 left-4 flex size-8 items-center justify-center rounded-full border border-white/80 bg-white/90 text-xs font-bold text-[#285d89] shadow-sm">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="min-w-0 p-5 sm:p-6">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                        <span className="rounded-md bg-[#173f68] px-2 py-1 tracking-[0.08em] text-white">
                          {targetLabels[project.type]}
                        </span>
                        <span
                          className={`rounded-md border px-2 py-1 ${categoryStyles[project.category]}`}
                        >
                          {categoryLabels[project.category]}
                        </span>
                        <span className="text-[#8295a7]">#{project.id}</span>
                      </div>

                      <h3 className="mt-3 text-xl font-bold tracking-[-0.03em] text-[#173f68] sm:text-2xl">
                        {project.title}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#657b90]">
                        {project.description}
                      </p>

                      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="프로젝트 태그">
                        {project.tags.map((tag) => (
                          <li
                            key={tag}
                            className="rounded-md border border-[#dae5ee] bg-[#f8fbfd] px-2 py-1 text-[11px] font-medium text-[#5f7589]"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col justify-between border-t border-[#e4edf4] bg-[#f8fbfe] p-5 md:col-span-2 lg:col-span-1 lg:border-t-0 lg:border-l">
                      <div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-semibold text-[#6b8296]">AI 유사도</span>
                          <strong className="text-lg text-[#195f96]">{similarityPercent}%</strong>
                        </div>
                        <div
                          role="progressbar"
                          aria-label={`${project.title} 유사도`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={similarityPercent}
                          className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#dce9f2]"
                        >
                          <div
                            className="h-full rounded-full bg-[linear-gradient(90deg,#69b7e7,#21679d)]"
                            style={{ width: `${similarityPercent}%` }}
                          />
                        </div>
                        <p className="mt-3 text-xs leading-5 text-[#7b8fa1]">
                          상세 유사점, 차이점과 원본 자료는 잠겨 있습니다.
                        </p>
                      </div>

                      <button
                        type="button"
                        aria-describedby="payment-example-note"
                        data-detail-path={project.detailPath}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#bfd6e7] bg-white px-4 py-3 text-sm font-bold text-[#174f87] outline-none transition group-hover:border-[#8eb9d8] group-hover:bg-[#edf7ff] focus-visible:ring-2 focus-visible:ring-[#317bb8] focus-visible:ring-offset-2"
                      >
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 20 20"
                          className="size-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <rect x="4" y="8" width="12" height="9" rx="2" />
                          <path d="M7 8V6a3 3 0 0 1 6 0v2" />
                        </svg>
                        1,000원 · 상세 보기
                      </button>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
          <p
            id="payment-example-note"
            className="mt-5 text-right text-xs leading-5 text-[#7a8fa2]"
          >
            표시된 가격과 결제 버튼은 디자인 검토용 예시이며 실제 결제는 진행되지
            않습니다.
          </p>
        </section>
      </div>
    </main>
  );
}

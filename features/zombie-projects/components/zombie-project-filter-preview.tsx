const filterPreviews = [
  {
    label: "분야·방법",
    defaultValue: "전체 분야",
    examples: "IT · 환경 · 디자인 · 콘텐츠 · 사회 문제",
  },
  {
    label: "제공 자산",
    defaultValue: "모든 자산",
    examples: "소스코드 · 기획 문서 · 디자인 · 데이터",
  },
  {
    label: "결과물 단계",
    defaultValue: "모든 결과물 단계",
    examples: "아이디어·기획 · 구체화·설계 · 초기 결과물 · 출품 결과물 · 실제 적용·운영",
  },
  {
    label: "현재 활동 상태",
    defaultValue: "모든 활동 상태",
    examples: "진행 중 · 일시 중단 · 활동 종료",
  },
  {
    label: "출품 유형",
    defaultValue: "모든 출품 유형",
    examples: "공모전 · 해커톤 · 캡스톤 · 교내 대회",
  },
  {
    label: "자산 라이선스",
    defaultValue: "모든 라이선스",
    examples: "출처 표시 · 동일 조건 공유 · 공개 사용 허용",
  },
  {
    label: "정렬",
    defaultValue: "최신 등록순",
    examples: "최신순 · 인기순 · 자산 많은 순",
  },
] as const;

export default function ZombieProjectFilterPreview() {
  return (
    <aside
      className="mt-8 border-y border-slate-300 bg-white px-5 py-6 sm:px-6"
      aria-labelledby="search-filter-preview-heading"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2
          id="search-filter-preview-heading"
          className="text-xl font-bold tracking-[-0.025em] text-slate-900"
        >
          검색 결과 필터
        </h2>
        <strong className="text-sm font-bold text-brand">백엔드 미구현</strong>
      </div>
      <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
        현재 API는 프로젝트명 검색만 지원하며 공개 자산의 라이선스도 제공하지 않습니다. 아래 필터는 연결 전까지 적용되지 않습니다.
      </p>

      <fieldset disabled className="mt-5 flex flex-wrap gap-x-4 gap-y-5">
        <legend className="sr-only">구현 예정 검색 필터</legend>
        {filterPreviews.map((filter) => (
          <label
            key={filter.label}
            className="w-full sm:min-w-64 sm:flex-1 sm:basis-[30%]"
          >
            <span className="text-sm font-bold text-slate-700">
              {filter.label}
            </span>
            <select
              disabled
              defaultValue="default"
              className="mt-2 h-11 w-full cursor-not-allowed border border-slate-300 bg-slate-100 px-3 text-sm text-slate-500 opacity-70"
            >
              <option value="default">{filter.defaultValue}</option>
            </select>
            <span className="mt-2 block text-xs leading-5 text-slate-500">
              예: {filter.examples}
            </span>
          </label>
        ))}
      </fieldset>
    </aside>
  );
}

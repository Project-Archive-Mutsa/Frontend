const filterPreviews = [
  {
    label: "주제·기술",
    defaultValue: "전체 주제",
    examples: "AI·데이터 · 웹·앱 · 콘텐츠 · 하드웨어",
  },
  {
    label: "제공 자산",
    defaultValue: "모든 자산",
    examples: "소스코드 · 기획 문서 · 디자인 · 데이터",
  },
  {
    label: "개발 진행도",
    defaultValue: "모든 진행도",
    examples: "아이디어 · 프로토타입 · MVP · 운영 이력",
  },
  {
    label: "프로젝트 규모",
    defaultValue: "모든 규모",
    examples: "파일 수 · 구현 범위 · 팀 규모",
  },
  {
    label: "등록 가격",
    defaultValue: "전체 가격대",
    examples: "무료 · 협의 필요 · 금액 구간",
  },
  {
    label: "후속 개발 방식",
    defaultValue: "모든 방식",
    examples: "공동 개발 · 인수·계승 · 기술 지원",
  },
] as const;

export default function ZombieProjectFilterPreview() {
  return (
    <aside
      className="mt-8 border-y border-[#c5d4df] bg-white px-5 py-6 sm:px-6"
      aria-labelledby="search-filter-preview-heading"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2
          id="search-filter-preview-heading"
          className="text-xl font-bold tracking-[-0.025em] text-[#24445f]"
        >
          검색 결과 필터
        </h2>
        <strong className="text-sm text-[#805113]">백엔드 미구현</strong>
      </div>
      <p className="mt-2 max-w-4xl text-sm leading-6 text-[#60778b]">
        현재 API는 프로젝트명 검색만 지원합니다. 아래 항목은 필요한 필터 방향을 보여주는 비활성 UI이며, 검색 결과에는 적용되지 않습니다.
      </p>

      <fieldset disabled className="mt-5 flex flex-wrap gap-x-4 gap-y-5">
        <legend className="sr-only">구현 예정 검색 필터</legend>
        {filterPreviews.map((filter) => (
          <label
            key={filter.label}
            className="w-full sm:min-w-64 sm:flex-1 sm:basis-[30%]"
          >
            <span className="text-sm font-bold text-[#51697d]">
              {filter.label}
            </span>
            <select
              disabled
              defaultValue="default"
              className="mt-2 h-11 w-full cursor-not-allowed border border-[#c7d4de] bg-[#edf1f4] px-3 text-sm text-[#65798a] opacity-60"
            >
              <option value="default">{filter.defaultValue}</option>
            </select>
            <span className="mt-2 block text-xs leading-5 text-[#718292]">
              예: {filter.examples}
            </span>
          </label>
        ))}
      </fieldset>
    </aside>
  );
}

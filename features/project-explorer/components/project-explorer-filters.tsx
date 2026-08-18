const filterGroups = [
  {
    label: "출품 유형",
    options: ["공모전", "해커톤", "캡스톤", "교내 대회"],
  },
  {
    label: "출품 연도",
    options: ["2026", "2025", "2024 이전"],
  },
  {
    label: "분야",
    options: ["IT·소프트웨어", "환경·에너지", "문화·콘텐츠"],
  },
  {
    label: "결과물 단계",
    options: ["아이디어·기획", "구체화·설계", "초기 결과물", "출품 결과물", "실제 적용·운영"],
  },
  {
    label: "현재 활동 상태",
    options: ["진행 중", "일시 중단", "활동 종료"],
  },
  {
    label: "등록 목적",
    options: ["아카이브", "좀비 공개", "프로젝트 판매", "팀원 모집"],
  },
] as const;

export default function ProjectExplorerFilters() {
  return (
    <aside
      className="border-y border-slate-300 py-6 lg:border-r lg:border-b-0 lg:pr-7"
      aria-labelledby="project-filter-heading"
    >
      <h2 id="project-filter-heading" className="text-lg font-bold text-slate-950">
        프로젝트 필터
      </h2>
      <p
        id="project-filter-description"
        className="mt-2 text-sm leading-6 text-slate-600"
      >
        행사·분야·결과물 단계·활동 상태를 조합한 전체 조회는 아직 연결되지 않았습니다.
      </p>
      <strong className="mt-3 block text-xs font-bold text-brand">
        백엔드 미구현
      </strong>

      <fieldset
        disabled
        aria-describedby="project-filter-description"
        className="mt-6 space-y-6"
      >
        <legend className="sr-only">구현 예정 프로젝트 복합 필터</legend>
        {filterGroups.map((group) => (
          <div key={group.label}>
            <h3 className="text-sm font-bold text-slate-800">{group.label}</h3>
            <div className="mt-3 space-y-2.5">
              {group.options.map((option) => (
                <label
                  key={option}
                  className="flex min-h-7 cursor-not-allowed items-center gap-3 text-sm text-slate-500 opacity-65"
                >
                  <input
                    type="checkbox"
                    disabled
                    className="size-4 accent-brand"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </fieldset>
    </aside>
  );
}

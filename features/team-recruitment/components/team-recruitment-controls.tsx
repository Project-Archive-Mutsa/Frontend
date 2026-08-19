const disabledControlClassName =
  "mt-2 h-11 w-full cursor-not-allowed border border-slate-300 bg-slate-100 px-3 text-sm text-slate-500 opacity-70";

export default function TeamRecruitmentControls() {
  return (
    <aside
      className="mt-8 border-y border-slate-300 bg-white px-5 py-6 sm:px-6"
      aria-labelledby="team-recruitment-controls-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2
            id="team-recruitment-controls-heading"
            className="text-xl font-bold tracking-[-0.025em] text-slate-900"
          >
            모집글 검색과 필터
          </h2>
          <p
            id="team-recruitment-controls-description"
            className="mt-2 max-w-3xl text-sm leading-6 text-slate-600"
          >
            모집 목록 API가 프로젝트·역할·관심 분야·일정 필터를 지원하지 않아 현재는 UI만 제공됩니다.
          </p>
        </div>
        <strong className="border border-brand px-2 py-1 text-xs font-bold text-brand">
          백엔드 미구현
        </strong>
      </div>

      <fieldset
        disabled
        aria-describedby="team-recruitment-controls-description"
        className="mt-5 grid gap-4 lg:grid-cols-[minmax(18rem,2fr)_repeat(3,minmax(9rem,1fr))_auto] lg:items-end"
      >
        <legend className="sr-only">구현 예정 모집글 검색과 필터</legend>

        <label className="min-w-0">
          <span className="text-sm font-bold text-slate-700">모집글 검색</span>
          <input
            type="search"
            name="q"
            disabled
            placeholder="제목이나 프로젝트를 검색하세요"
            className={disabledControlClassName}
          />
        </label>

        <label className="min-w-0">
          <span className="text-sm font-bold text-slate-700">모집 역할</span>
          <select
            name="role"
            disabled
            defaultValue="all"
            className={disabledControlClassName}
          >
            <option value="all">전체 역할</option>
          </select>
        </label>

        <label className="min-w-0">
          <span className="text-sm font-bold text-slate-700">관심 분야</span>
          <select
            name="field"
            disabled
            defaultValue="all"
            className={disabledControlClassName}
          >
            <option value="all">전체 분야</option>
          </select>
        </label>

        <label className="min-w-0">
          <span className="text-sm font-bold text-slate-700">정렬</span>
          <select
            name="sort"
            disabled
            defaultValue="deadline"
            className={disabledControlClassName}
          >
            <option value="deadline">마감 임박순</option>
          </select>
        </label>

        <button
          type="button"
          disabled
          className="h-11 cursor-not-allowed border border-slate-300 bg-slate-200 px-5 text-sm font-bold text-slate-500 opacity-70"
        >
          검색
        </button>
      </fieldset>
    </aside>
  );
}

export default function MainAiSearchInput() {
  return (
    <div className="relative isolate overflow-hidden rounded-[1.8rem] p-[1.5px] shadow-[0_24px_70px_-30px_rgba(24,74,125,0.55)]">
      <div
        aria-hidden="true"
        className="absolute -inset-[220%] animate-[spin_7s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,#78c7f2_65deg,#245f96_120deg,transparent_180deg,transparent_360deg)] motion-reduce:animate-none"
      />
      <div className="relative rounded-[calc(1.8rem-1.5px)] bg-white p-2 sm:flex sm:items-center">
        <label className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 sm:px-5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#eaf4ff] text-[#1d5f9f]">
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
            name="project-search"
            placeholder="만들려는 서비스나 기능을 검색해 보세요"
            className="min-w-0 flex-1 bg-transparent text-sm text-[#102a43] outline-none placeholder:text-[#7d91a8] sm:text-base"
          />
        </label>

        <div className="flex items-center justify-center gap-2 rounded-[1.25rem] bg-[#174f87] px-5 py-4 text-sm font-semibold text-white shadow-[0_12px_28px_-14px_rgba(23,79,135,0.9)] sm:min-w-44">
          <span className="rounded-full bg-[#8ed2ff] px-2 py-0.5 text-[10px] font-bold tracking-[0.12em] text-[#123b67]">
            AI
          </span>
          프로젝트 찾아보기
        </div>
      </div>
    </div>
  );
}

export default function MainAiSearchInput() {
  return (
    <form
      action="/search"
      method="get"
      className="relative isolate overflow-hidden rounded-2xl bg-[#b6cee2] p-[1.5px] shadow-[0_18px_44px_-24px_rgba(24,72,113,0.5),0_6px_16px_-10px_rgba(24,72,113,0.28)] transition-shadow focus-within:shadow-[0_22px_52px_-22px_rgba(31,91,145,0.58),0_0_0_4px_rgba(89,168,225,0.12)]"
    >
      <div
        aria-hidden="true"
        className="absolute -inset-[220%] animate-[spin_7s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,#78c7f2_65deg,#245f96_120deg,transparent_180deg,transparent_360deg)] motion-reduce:animate-none"
      />
      <div className="relative rounded-[calc(1rem-1.5px)] bg-white p-2 sm:flex sm:items-center">
        <label className="flex min-w-0 flex-1 items-center px-4 py-3 sm:px-5">
          <span className="sr-only">AI 프로젝트 검색</span>
          <input
            type="search"
            name="q"
            required
            placeholder="만들려는 서비스나 기능을 검색해 보세요"
            className="min-w-0 flex-1 bg-transparent text-sm text-[#102a43] outline-none placeholder:text-[#7d91a8] sm:text-base"
          />
        </label>

        <button
          type="submit"
          className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-brand px-4 text-xs font-semibold whitespace-nowrap text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-4 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.8-3.8" />
          </svg>
          프로젝트 찾아보기
        </button>
      </div>
    </form>
  );
}

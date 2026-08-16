export default function AiSearchInput() {
  return (
    <label className="order-3 mt-3 hidden h-10 min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/15 bg-white/95 px-3 text-[#173f68] shadow-sm md:flex lg:order-none lg:mt-0 lg:max-w-xs xl:max-w-sm">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-4 shrink-0 text-[#3975aa]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.8-3.8" />
      </svg>
      <span className="sr-only">프로젝트 검색</span>
      <input
        type="search"
        placeholder="프로젝트, 아이디어 검색"
        className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-[#8395a8]"
      />
      <span className="rounded-md bg-[#e5f2ff] px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-[#28679d]">
        AI
      </span>
    </label>
  );
}

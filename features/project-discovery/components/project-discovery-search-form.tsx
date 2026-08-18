interface ProjectDiscoverySearchFormProps {
  defaultQuery?: string;
}

export default function ProjectDiscoverySearchForm({
  defaultQuery = "",
}: ProjectDiscoverySearchFormProps) {
  return (
    <form
      action="/search"
      method="get"
      role="search"
      className="flex flex-col gap-3 border border-brand-soft bg-white p-2 shadow-[0_14px_36px_-28px_rgba(18,63,112,0.65)] sm:flex-row sm:items-center"
    >
      <label className="min-w-0 flex-1">
        <span className="sr-only">AI 프로젝트 검색어</span>
        <input
          type="search"
          name="q"
          required
          defaultValue={defaultQuery}
          placeholder="만들려는 서비스나 기능을 검색해 보세요"
          className="h-12 w-full bg-transparent px-4 text-base text-[#102a43] outline-none placeholder:text-[#7d91a8]"
        />
      </label>
      <button
        type="submit"
        className="h-12 shrink-0 bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        프로젝트 찾아보기
      </button>
    </form>
  );
}

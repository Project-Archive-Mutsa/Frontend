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
      className="flex flex-col gap-3 border border-slate-300 bg-white p-2 focus-within:border-brand-accent focus-within:ring-2 focus-within:ring-brand-soft sm:flex-row sm:items-center"
    >
      <label className="min-w-0 flex-1">
        <span className="sr-only">AI 프로젝트 검색어</span>
        <input
          type="search"
          name="q"
          required
          defaultValue={defaultQuery}
          placeholder="만들려는 서비스나 기능을 검색해 보세요"
          className="h-12 w-full bg-transparent px-4 text-base text-slate-950 outline-none placeholder:text-slate-500"
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

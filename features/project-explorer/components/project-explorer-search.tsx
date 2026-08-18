import Form from "next/form";
import Link from "next/link";
import ProjectExplorerSearchSubmitButton from "./project-explorer-search-submit-button";

interface ProjectExplorerSearchProps {
  query: string;
}

export default function ProjectExplorerSearch({
  query,
}: ProjectExplorerSearchProps) {
  return (
    <section
      className="mt-9 border-y border-slate-300 bg-white px-5 py-6 sm:px-6"
      aria-labelledby="project-search-heading"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="project-search-heading"
            className="text-lg font-bold text-slate-950"
          >
            프로젝트 이름 검색
          </h2>
          <p
            id="project-search-description"
            className="mt-2 text-sm leading-6 text-slate-600"
          >
            공모전·대회·해커톤·캡스톤에 출품된 프로젝트를 찾습니다.
          </p>
        </div>
        {query ? (
          <Link
            href="/projects"
            className="text-sm font-bold text-brand underline decoration-brand-accent underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
          >
            검색 초기화
          </Link>
        ) : null}
      </div>

      <Form
        action="/projects"
        scroll={false}
        role="search"
        aria-describedby="project-search-description"
        className="mt-5 flex max-w-3xl items-center gap-2 border border-slate-300 bg-white p-2 focus-within:border-brand-accent focus-within:ring-2 focus-within:ring-brand-soft"
      >
        <label className="min-w-0 flex-1">
          <span className="sr-only">프로젝트 이름</span>
          <input
            type="search"
            name="q"
            required
            pattern={String.raw`.*\S.*`}
            title="공백이 아닌 검색어를 입력해 주세요."
            defaultValue={query}
            placeholder="프로젝트 이름을 입력해 주세요"
            className="h-12 w-full px-4 text-base text-slate-950 outline-none placeholder:text-slate-500"
          />
        </label>
        <ProjectExplorerSearchSubmitButton />
      </Form>
    </section>
  );
}

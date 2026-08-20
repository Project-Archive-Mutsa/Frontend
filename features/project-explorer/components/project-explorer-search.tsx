import Form from "next/form";
import Link from "next/link";
import ProjectExplorerSearchSubmitButton from "./project-explorer-search-submit-button";

interface ProjectExplorerSearchProps {
  action: string;
  query: string;
  description: string;
  hiddenFields?: Readonly<Record<string, string>>;
  inputId: string;
}

function getResetHref(
  action: string,
  hiddenFields: Readonly<Record<string, string>>,
) {
  const params = new URLSearchParams();
  Object.entries(hiddenFields).forEach(([name, value]) => {
    if (value) params.set(name, value);
  });
  const queryString = params.toString();
  return queryString ? `${action}?${queryString}` : action;
}

export default function ProjectExplorerSearch({
  action,
  query,
  description,
  hiddenFields = {},
  inputId,
}: ProjectExplorerSearchProps) {
  const headingId = `${inputId}-heading`;
  const descriptionId = `${inputId}-description`;

  return (
    <section
      className="mt-9 border-y border-slate-300 bg-white px-5 py-6 sm:px-6"
      aria-labelledby={headingId}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id={headingId}
            className="text-lg font-bold text-slate-950"
          >
            프로젝트 이름 검색
          </h2>
          <p
            id={descriptionId}
            className="mt-2 text-sm leading-6 text-slate-600"
          >
            {description}
          </p>
        </div>
        {query ? (
          <Link
            href={getResetHref(action, hiddenFields)}
            className="text-sm font-bold text-brand underline decoration-brand-accent underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
          >
            검색 초기화
          </Link>
        ) : null}
      </div>

      <Form
        action={action}
        scroll={false}
        role="search"
        aria-describedby={descriptionId}
        className="mt-5 flex max-w-3xl items-center gap-2 border border-slate-300 bg-white p-2 focus-within:border-brand-accent focus-within:ring-2 focus-within:ring-brand-soft"
      >
        {Object.entries(hiddenFields).map(([name, value]) =>
          value ? <input key={name} type="hidden" name={name} value={value} /> : null,
        )}
        <label htmlFor={inputId} className="min-w-0 flex-1">
          <span className="sr-only">프로젝트 이름 검색</span>
          <input
            id={inputId}
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

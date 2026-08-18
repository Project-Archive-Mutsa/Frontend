import Form from "next/form";
import ProjectMarketSearchSubmitButton from "./project-market-search-submit-button";

const disabledSelectClassName =
  "mt-2 h-11 w-full cursor-not-allowed border border-slate-300 bg-slate-100 px-3 text-sm text-slate-500 opacity-70";

interface ProjectMarketControlsProps {
  defaultQuery: string;
}

export default function ProjectMarketControls({
  defaultQuery,
}: ProjectMarketControlsProps) {
  return (
    <aside
      className="mt-8 border-y border-slate-300 bg-white px-5 py-6 sm:px-6"
      aria-labelledby="project-market-controls-heading"
    >
      <h2
        id="project-market-controls-heading"
        className="text-xl font-bold tracking-[-0.025em] text-slate-900"
      >
        프로젝트 검색과 필터
      </h2>

      <div className="mt-5">
        <label
          htmlFor="project-market-search"
          className="text-sm font-bold text-slate-700"
        >
          프로젝트 이름 검색
        </label>
        <p
          id="project-market-search-description"
          className="mt-1 text-sm text-slate-600"
        >
          상세 리포트 열람과 별개로, 자산·권리 판매를 제안한 프로젝트를 찾습니다.
        </p>
        <Form
          action="/project-market"
          scroll={false}
          role="search"
          className="mt-3 flex items-center gap-2 border border-slate-300 bg-white p-2 focus-within:border-brand-accent focus-within:ring-2 focus-within:ring-brand-soft"
        >
          <input
            id="project-market-search"
            type="search"
            name="q"
            required
            pattern={String.raw`.*\S.*`}
            title="공백이 아닌 검색어를 입력해 주세요."
            autoComplete="off"
            defaultValue={defaultQuery}
            aria-describedby="project-market-search-description"
            placeholder="프로젝트 이름을 입력해 주세요"
            className="h-12 min-w-0 flex-1 px-4 text-base text-slate-900 outline-none placeholder:text-slate-500"
          />
          <ProjectMarketSearchSubmitButton />
        </Form>
      </div>

      <div className="mt-6 border-t border-slate-200 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-bold text-slate-800">상세 필터</h3>
          <strong className="border border-brand px-2 py-1 text-xs font-bold text-brand">
            백엔드 미구현
          </strong>
        </div>
        <p
          id="project-market-filter-description"
          className="mt-2 text-sm leading-6 text-slate-600"
        >
          제공 자산, 권리 범위와 가격대를 조합하는 조회 API가 아직 없습니다.
        </p>

        <fieldset
          disabled
          aria-describedby="project-market-filter-description"
          className={
            // deslop-ignore-next-line 28 -- 기능성 필터 배치이며 카드 그리드가 아님
            "mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          }
        >
          <legend className="sr-only">구현 예정 프로젝트 필터</legend>

          <label className="min-w-0">
            <span className="text-sm font-bold text-slate-700">제공 자산</span>
            <select
              name="assetType"
              disabled
              defaultValue="all"
              className={disabledSelectClassName}
            >
              <option value="all">모든 자산</option>
            </select>
          </label>

          <label className="min-w-0">
            <span className="text-sm font-bold text-slate-700">권리 범위</span>
            <select
              name="rightsScope"
              disabled
              defaultValue="all"
              className={disabledSelectClassName}
            >
              <option value="all">전체 권리 범위</option>
            </select>
          </label>

          <label className="min-w-0">
            <span className="text-sm font-bold text-slate-700">가격대</span>
            <select
              name="priceRange"
              disabled
              defaultValue="all"
              className={disabledSelectClassName}
            >
              <option value="all">전체 가격대</option>
            </select>
          </label>

          <label className="min-w-0">
            <span className="text-sm font-bold text-slate-700">정렬</span>
            <select
              name="sort"
              disabled
              defaultValue="latest"
              className={disabledSelectClassName}
            >
              <option value="latest">최신 등록순</option>
            </select>
          </label>
        </fieldset>
      </div>
    </aside>
  );
}

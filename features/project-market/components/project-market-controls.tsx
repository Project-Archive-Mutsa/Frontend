import Form from "next/form";
import BackendContractNotice from "@/shared/components/backend-contract-notice/backend-contract-notice";
import ProjectMarketSearchSubmitButton from "./project-market-search-submit-button";

const selectClassName = "mt-2 h-11 w-full border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-soft";

interface Props { state: { query: string; assetCategory: string; category: string; sort: "RECENT" | "POPULAR" } }

export default function ProjectMarketControls({ state }: Props) {
  return (
    <aside className="mt-8 border-y border-slate-300 bg-white px-5 py-6 sm:px-6" aria-labelledby="project-market-controls-heading">
      <h2 id="project-market-controls-heading" className="text-xl font-bold tracking-[-0.025em] text-slate-900">프로젝트 검색과 필터</h2>
      <Form action="/project-market" scroll={false} role="search" className="mt-5">
        <label htmlFor="project-market-search" className="text-sm font-bold text-slate-700">프로젝트 이름 검색</label>
        <div className="mt-2 flex items-center gap-2 border border-slate-300 bg-white p-2 focus-within:border-brand-accent focus-within:ring-2 focus-within:ring-brand-soft">
          <input id="project-market-search" type="search" name="q" defaultValue={state.query} autoComplete="off" placeholder="프로젝트 이름을 입력해 주세요" className="h-12 min-w-0 flex-1 px-4 text-base text-slate-900 outline-none placeholder:text-slate-500" />
          <ProjectMarketSearchSubmitButton />
        </div>
        <fieldset className="mt-6 grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-3">
          <legend className="sr-only">판매 프로젝트 상세 필터</legend>
          <label><span className="text-sm font-bold text-slate-700">제공 자산</span><select name="assetCategory" defaultValue={state.assetCategory} className={selectClassName}><option value="">모든 자산</option><option value="PLANNING">기획·문서</option><option value="DESIGN">디자인</option><option value="CODE">코드·기술</option><option value="DATA">데이터</option><option value="RESEARCH">연구·검증</option><option value="PRESENTATION">발표·시연</option><option value="OTHER">기타</option></select></label>
          <label><span className="text-sm font-bold text-slate-700">분야</span><select name="category" defaultValue={state.category} className={selectClassName}><option value="">전체 분야</option>{["사회문제", "교육", "환경·에너지", "문화·예술", "제품·산업 디자인", "창업·비즈니스", "기술·공학", "연구"].map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span className="text-sm font-bold text-slate-700">정렬</span><select name="sort" defaultValue={state.sort} className={selectClassName}><option value="RECENT">최신 등록순</option><option value="POPULAR">인기순</option></select></label>
        </fieldset>
      </Form>
      <div className="mt-5"><BackendContractNotice>가격 조건과 가격대는 목록 조회 조건이 제공되지 않아 아직 필터링할 수 없습니다.</BackendContractNotice></div>
    </aside>
  );
}

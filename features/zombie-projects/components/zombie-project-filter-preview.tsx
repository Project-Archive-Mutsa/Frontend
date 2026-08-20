import Form from "next/form";

const selectClassName = "mt-2 h-11 w-full border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-soft";
type State = { query: string; category: string; assetCategory: string; resultLevel: string; activityStatus: string; eventType: string; sort: "RECENT" | "POPULAR" };

const defaultState: State = { query: "", category: "", assetCategory: "", resultLevel: "", activityStatus: "", eventType: "", sort: "RECENT" };

export default function ZombieProjectFilterPreview({ state = defaultState }: { state?: State }) {
  return (
    <aside className="mt-8 border-y border-slate-300 bg-white px-5 py-6 sm:px-6" aria-labelledby="search-filter-preview-heading">
      <h2 id="search-filter-preview-heading" className="text-xl font-bold tracking-[-0.025em] text-slate-900">검색 결과 필터</h2>
      <Form action="/zombie-projects" scroll={false} className="mt-5 grid gap-4 sm:grid-cols-3">
        {state.query ? <input type="hidden" name="q" value={state.query} /> : null}
        <label><span className="text-sm font-bold text-slate-700">분야</span><select name="category" defaultValue={state.category} className={selectClassName}><option value="">전체 분야</option>{["사회문제", "교육", "환경·에너지", "문화·예술", "제품·산업 디자인", "창업·비즈니스", "기술·공학", "연구"].map((v) => <option key={v}>{v}</option>)}</select></label>
        <label><span className="text-sm font-bold text-slate-700">제공 자산</span><select name="assetCategory" defaultValue={state.assetCategory} className={selectClassName}><option value="">모든 자산</option><option value="PLANNING">기획·문서</option><option value="DESIGN">디자인</option><option value="CODE">코드·기술</option><option value="DATA">데이터</option><option value="RESEARCH">연구·검증</option><option value="PRESENTATION">발표·시연</option><option value="OTHER">기타</option></select></label>
        <label><span className="text-sm font-bold text-slate-700">결과물 단계</span><select name="resultLevel" defaultValue={state.resultLevel} className={selectClassName}><option value="">전체 단계</option><option value="IDEA_PLAN">아이디어·기획</option><option value="DESIGNED">구체화·설계</option><option value="INITIAL_OUTPUT">초기 결과물</option><option value="SUBMISSION_OUTPUT">출품 결과물</option><option value="APPLIED">실제 적용·운영</option></select></label>
        <label><span className="text-sm font-bold text-slate-700">활동 상태</span><select name="activityStatus" defaultValue={state.activityStatus} className={selectClassName}><option value="">전체 상태</option><option value="ACTIVE">진행 중</option><option value="PAUSED">일시 중단</option><option value="ENDED">활동 종료</option></select></label>
        <label><span className="text-sm font-bold text-slate-700">출품 유형</span><select name="eventType" defaultValue={state.eventType} className={selectClassName}><option value="">모든 유형</option><option value="COMPETITION">대회</option><option value="CONTEST">공모전</option><option value="HACKATHON">해커톤</option><option value="CAPSTONE">캡스톤</option><option value="COURSE">교과·교내 프로그램</option></select></label>
        <label><span className="text-sm font-bold text-slate-700">정렬</span><select name="sort" defaultValue={state.sort} className={selectClassName}><option value="RECENT">최신 등록순</option><option value="POPULAR">인기순</option></select></label>
        <button type="submit" className="min-h-11 bg-brand px-4 text-sm font-bold text-white hover:bg-brand-hover sm:col-span-3">필터 적용</button>
      </Form>
    </aside>
  );
}

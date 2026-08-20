import Form from "next/form";
import type { ProjectExplorerSearchState } from "@/features/project-explorer/model/types";

const selectClassName =
  "mt-2 h-11 w-full border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-soft";

const groups = [
  { name: "eventType", label: "출품 유형", options: [["COMPETITION", "대회"], ["CONTEST", "공모전"], ["HACKATHON", "해커톤"], ["CAPSTONE", "캡스톤"], ["COURSE", "교과·교내 프로그램"], ["OTHER", "기타"]] },
  { name: "eventYear", label: "출품 연도", options: [["2026", "2026"], ["2025", "2025"], ["2024", "2024"]] },
  { name: "category", label: "분야", options: [["사회문제", "사회문제"], ["교육", "교육"], ["환경·에너지", "환경·에너지"], ["문화·예술", "문화·예술"], ["제품·산업 디자인", "제품·산업 디자인"], ["창업·비즈니스", "창업·비즈니스"], ["기술·공학", "기술·공학"], ["연구", "연구"]] },
  { name: "resultLevel", label: "결과물 단계", options: [["IDEA_PLAN", "아이디어·기획"], ["DESIGNED", "구체화·설계"], ["INITIAL_OUTPUT", "초기 결과물"], ["SUBMISSION_OUTPUT", "출품 결과물"], ["APPLIED", "실제 적용·운영"]] },
  { name: "activityStatus", label: "현재 활동 상태", options: [["ACTIVE", "진행 중"], ["PAUSED", "일시 중단"], ["ENDED", "활동 종료"]] },
] as const;

export default function ProjectExplorerFilters({ state }: { state: ProjectExplorerSearchState }) {
  return (
    <aside className="border-y border-slate-300 py-6 lg:border-r lg:border-b-0 lg:pr-7" aria-labelledby="project-filter-heading">
      <h2 id="project-filter-heading" className="text-lg font-bold text-slate-950">프로젝트 필터</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">행사·분야·완성도·활동 상태를 조합해 조회합니다.</p>
      <Form action="/projects" scroll={false} className="mt-6 space-y-5">
        {state.query ? <input type="hidden" name="q" value={state.query} /> : null}
        {groups.map((group) => (
          <label key={group.name} className="block">
            <span className="text-sm font-bold text-slate-800">{group.label}</span>
            <select name={group.name} defaultValue={state[group.name]} className={selectClassName}>
              <option value="">전체</option>
              {group.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
        ))}
        <label className="block">
          <span className="text-sm font-bold text-slate-800">정렬</span>
          <select name="sort" defaultValue={state.sort} className={selectClassName}>
            <option value="RECENT">최신 등록순</option>
            <option value="POPULAR">인기순</option>
          </select>
        </label>
        <button type="submit" className="min-h-11 w-full bg-brand px-4 text-sm font-bold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent">필터 적용</button>
      </Form>
    </aside>
  );
}

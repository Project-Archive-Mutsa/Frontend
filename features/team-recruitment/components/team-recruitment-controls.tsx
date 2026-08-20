import Form from "next/form";

const controlClassName = "mt-2 h-11 w-full border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-soft";
type State = { query: string; role: string; status: "" | "OPEN" | "CLOSED" };

export default function TeamRecruitmentControls({ state }: { state: State }) {
  return (
    <aside className="mt-8 border-y border-slate-300 bg-white px-5 py-6 sm:px-6" aria-labelledby="team-recruitment-controls-heading">
      <h2 id="team-recruitment-controls-heading" className="text-xl font-bold tracking-[-0.025em] text-slate-900">모집글 검색과 필터</h2>
      <Form action="/team-recruitment" scroll={false} className="mt-5 grid gap-4 lg:grid-cols-[minmax(18rem,2fr)_minmax(10rem,1fr)_minmax(9rem,1fr)_auto] lg:items-end">
        <label><span className="text-sm font-bold text-slate-700">모집글 검색</span><input type="search" name="q" defaultValue={state.query} placeholder="제목이나 프로젝트를 검색하세요" className={controlClassName} /></label>
        <label><span className="text-sm font-bold text-slate-700">모집 역할</span><select name="role" defaultValue={state.role} className={controlClassName}><option value="">전체 역할</option>{["기획", "디자인", "개발", "데이터·리서치", "마케팅·운영", "제작·엔지니어링"].map((role) => <option key={role}>{role}</option>)}</select></label>
        <label><span className="text-sm font-bold text-slate-700">모집 상태</span><select name="status" defaultValue={state.status} className={controlClassName}><option value="">전체 상태</option><option value="OPEN">모집 중</option><option value="CLOSED">마감</option></select></label>
        <button type="submit" className="h-11 bg-brand px-5 text-sm font-bold text-white hover:bg-brand-hover">검색</button>
      </Form>
    </aside>
  );
}

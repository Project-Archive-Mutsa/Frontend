import Link from "next/link";
import { getZombieProjectPage } from "@/features/zombie-projects/api/get-zombie-projects";
import ZombieProjectItem from "./zombie-project-item";

type State = { query: string; category: string; assetCategory: string; resultLevel: string; activityStatus: string; eventType: string; sort: "RECENT" | "POPULAR"; page: number };

function pageHref(state: State, page: number) {
  const params = new URLSearchParams();
  Object.entries({ ...state, page }).forEach(([key, value]) => {
    if (value !== "" && !(key === "page" && value === 0)) params.set(key === "query" ? "q" : key, String(value));
  });
  return `/zombie-projects?${params.toString()}`;
}

export default async function ZombieProjectResults({ state }: { state: State }) {
  const result = await getZombieProjectPage(state);
  const { projects } = result;
  if (projects.length === 0) return <div className="flex min-h-56 items-center justify-center border-y border-slate-300 px-6 text-center text-sm text-slate-600">조건에 맞는 좀비 프로젝트가 없습니다.</div>;
  return (
    <div>
      <p className="text-sm text-slate-600">총 <strong className="font-bold text-slate-900">{result.totalElements.toLocaleString("ko-KR")}</strong>개의 좀비 프로젝트</p>
      <ul className="mt-4 divide-y divide-slate-300 border-y border-slate-300">{projects.map((project) => <li key={project.id}><ZombieProjectItem project={project} /></li>)}</ul>
      {result.totalPages > 1 ? <nav aria-label="좀비 프로젝트 목록 페이지" className="mt-6 flex items-center justify-between text-sm">{result.page > 0 ? <Link href={pageHref(state, result.page - 1)} className="font-bold text-brand underline underline-offset-4">이전</Link> : <span />}<span><strong>{result.page + 1}</strong> / {result.totalPages}</span>{result.page + 1 < result.totalPages ? <Link href={pageHref(state, result.page + 1)} className="font-bold text-brand underline underline-offset-4">다음</Link> : <span />}</nav> : null}
    </div>
  );
}

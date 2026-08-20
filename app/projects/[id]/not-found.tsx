import Link from "next/link";

export default function ProjectDetailNotFound() {
  return (
    <main className="flex flex-1 bg-slate-50">
      <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10" aria-labelledby="not-found-title">
        <p className="text-xs font-bold text-brand">404</p>
        <h1 id="not-found-title" className="font-display mt-3 text-3xl font-bold text-slate-950">
          프로젝트 기록을 찾을 수 없습니다
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
          삭제됐거나 존재하지 않는 프로젝트입니다. 주소를 확인하거나 탐색 목록으로 돌아가 주세요.
        </p>
        <Link
          href="/projects"
          className="mt-8 inline-flex min-h-11 items-center bg-brand px-5 text-sm font-bold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          프로젝트 탐색으로 돌아가기
        </Link>
      </section>
    </main>
  );
}

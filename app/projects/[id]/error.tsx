"use client";

import Link from "next/link";

export default function ProjectDetailError({ reset }: { reset: () => void }) {
  return (
    <main className="flex flex-1 bg-slate-50">
      <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10" aria-labelledby="detail-error-title">
        <p className="text-xs font-bold text-red-700">프로젝트 상세 정보 조회 실패</p>
        <h1 id="detail-error-title" className="font-display mt-3 text-3xl font-bold text-slate-950">
          프로젝트 기록을 불러오지 못했습니다
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
          잠시 뒤 다시 시도해 주세요. 문제가 계속되면 백엔드 배포와 상세 API 응답을 확인해야 합니다.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={reset}
            className="min-h-11 bg-brand px-5 text-sm font-bold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            다시 시도
          </button>
          <Link
            href="/projects"
            className="inline-flex min-h-11 items-center border-b-2 border-brand-accent px-1 text-sm font-bold text-brand hover:border-brand"
          >
            프로젝트 탐색으로 돌아가기
          </Link>
        </div>
      </section>
    </main>
  );
}

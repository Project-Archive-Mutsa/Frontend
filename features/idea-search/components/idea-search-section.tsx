import { Suspense, ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import IdeaList from './idea-list';

// 1. 임시 로딩 스피너 컴포넌트
function SectionLoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-20 text-slate-500">
      데이터를 불러오는 중입니다...
    </div>
  );
}

// 2. 임시 에러 경계 컴포넌트 (실제 공용 컴포넌트가 생기면 교체하세요)
function SectionErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary fallback={<div className="text-red-500 text-center py-10">데이터를 불러오는데 실패했습니다.</div>}>
      {children}
    </ErrorBoundary>
  );
}

export default function IdeaSearchSection() {
  return (
    <section className="max-w-3xl mx-auto py-10 px-5">
      <SectionErrorBoundary>
        <Suspense fallback={<SectionLoadingSpinner />}>
          <IdeaList />
        </Suspense>
      </SectionErrorBoundary>
    </section>
  );
}
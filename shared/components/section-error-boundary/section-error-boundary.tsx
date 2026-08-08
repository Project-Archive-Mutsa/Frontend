"use client";

import { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface SectionErrorBoundaryProps {
  children: ReactNode; // 감싸질 자식 컴포넌트들
}

export default function SectionErrorBoundary({ children }: SectionErrorBoundaryProps) {
  return (
    <ErrorBoundary 
      fallback={
        <p role="alert" className="text-red-500 text-center py-10">
          데이터를 불러오는데 실패했습니다.
        </p>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
"use client";

import { ClipLoader } from "react-spinners";

export default function SectionLoadingSpinner() {
  return (
    <div
      className="flex min-h-40 w-full items-center justify-center"
      role="status"
    >
      <ClipLoader size={32} aria-hidden />
      <span className="sr-only">콘텐츠를 불러오는 중입니다.</span>
    </div>
  );
}

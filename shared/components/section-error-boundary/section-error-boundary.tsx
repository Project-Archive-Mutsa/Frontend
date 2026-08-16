"use client";

import { unstable_catchError as catchError } from "next/error";

interface SectionErrorFallbackProps {
  message: string;
}

function SectionErrorFallback({ message }: SectionErrorFallbackProps) {
  return (
    <div
      role="alert"
      className="flex min-h-40 items-center justify-center rounded-2xl border border-[#d9e4ee] bg-white/80 px-6 text-center text-sm text-[#667d93]"
    >
      {message}
    </div>
  );
}

export default catchError(SectionErrorFallback);

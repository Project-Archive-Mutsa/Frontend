"use client";

import { useFormStatus } from "react-dom";
import LoadingSpinner from "@/shared/components/loading-spinner/loading-spinner";

export default function ProjectMarketSearchSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="flex h-12 min-w-24 shrink-0 cursor-pointer items-center justify-center gap-2 bg-brand px-5 text-sm font-bold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
    >
      {pending ? (
        <>
          <LoadingSpinner size={18} />
          <span>검색 중</span>
        </>
      ) : (
        "검색"
      )}
    </button>
  );
}

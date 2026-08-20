"use client";

import { useFormStatus } from "react-dom";
import LoadingSpinner from "@/shared/components/loading-spinner/loading-spinner";

export default function ProjectFilterSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="flex min-h-11 w-full items-center justify-center gap-2 bg-brand px-4 text-sm font-bold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
    >
      {pending ? (
        <>
          <LoadingSpinner size={18} />
          <span>필터 적용 중</span>
        </>
      ) : (
        "필터 적용"
      )}
    </button>
  );
}

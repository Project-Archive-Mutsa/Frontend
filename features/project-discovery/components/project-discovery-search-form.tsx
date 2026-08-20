"use client";

import { useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/shared/components/loading-spinner/loading-spinner";

interface ProjectDiscoverySearchFormProps {
  defaultQuery?: string;
}

export default function ProjectDiscoverySearchForm({
  defaultQuery = "",
}: ProjectDiscoverySearchFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const query = formData.get("q");
    if (typeof query !== "string" || !query.trim()) {
      return;
    }

    const searchParams = new URLSearchParams({ q: query.trim() });
    startTransition(() => {
      router.push(`/search?${searchParams.toString()}`);
    });
  }

  return (
    <form
      action="/search"
      method="get"
      role="search"
      aria-busy={isPending}
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 border border-slate-300 bg-white p-2 focus-within:border-brand-accent focus-within:ring-2 focus-within:ring-brand-soft sm:flex-row sm:items-center"
    >
      <label className="min-w-0 flex-1">
        <span className="sr-only">AI 프로젝트 검색어</span>
        <input
          type="search"
          name="q"
          required
          defaultValue={defaultQuery}
          placeholder="만들려는 서비스나 기능을 검색해 보세요"
          className="h-12 w-full bg-transparent px-4 text-base text-slate-950 outline-none placeholder:text-slate-500"
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-12 shrink-0 items-center justify-center gap-2 bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none"
      >
        {isPending ? <LoadingSpinner size={18} /> : null}
        {isPending ? "검색 중" : "프로젝트 찾아보기"}
      </button>
    </form>
  );
}

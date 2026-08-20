"use client";

import Form from "next/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useState,
  useTransition,
  type FocusEvent,
  type FormEvent,
} from "react";
import { useFormStatus } from "react-dom";
import LoadingSpinner from "@/shared/components/loading-spinner/loading-spinner";

const RECENT_SEARCHES_STORAGE_KEY = "zombie-project-recent-searches";
const MAXIMUM_RECENT_SEARCHES = 5;

interface ZombieProjectSearchFormProps {
  defaultQuery?: string;
  hiddenFields?: Readonly<Record<string, string>>;
}

interface SearchSubmitButtonProps {
  isNavigationPending: boolean;
}

function readRecentSearches(): readonly string[] {
  try {
    const storedValue = window.localStorage.getItem(
      RECENT_SEARCHES_STORAGE_KEY,
    );
    const parsedValue: unknown = storedValue ? JSON.parse(storedValue) : [];

    return Array.isArray(parsedValue)
      ? parsedValue.filter(
          (value): value is string =>
            typeof value === "string" && value.trim().length > 0,
        )
      : [];
  } catch {
    return [];
  }
}

function addRecentSearch(
  recentSearches: readonly string[],
  query: string,
): readonly string[] {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return recentSearches;
  }

  return [
    normalizedQuery,
    ...recentSearches.filter((item) => item !== normalizedQuery),
  ].slice(0, MAXIMUM_RECENT_SEARCHES);
}

function SearchSubmitButton({
  isNavigationPending,
}: SearchSubmitButtonProps) {
  const { pending } = useFormStatus();
  const isPending = pending || isNavigationPending;

  return (
    <button
      type="submit"
      disabled={isPending}
      aria-busy={isPending}
      className="flex h-12 min-w-28 shrink-0 cursor-pointer items-center justify-center gap-2 bg-brand px-6 text-sm font-bold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
    >
      {isPending ? (
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

export default function ZombieProjectSearchForm({
  defaultQuery = "",
  hiddenFields = {},
}: ZombieProjectSearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);
  const [recentSearches, setRecentSearches] = useState<readonly string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNavigationPending, startTransition] = useTransition();

  useEffect(() => {
    const storedSearches = readRecentSearches();
    const nextSearches = addRecentSearch(storedSearches, defaultQuery);
    window.localStorage.setItem(
      RECENT_SEARCHES_STORAGE_KEY,
      JSON.stringify(nextSearches),
    );
  }, [defaultQuery]);

  function rememberSearch(searchQuery: string) {
    const nextSearches = addRecentSearch(recentSearches, searchQuery);
    setRecentSearches(nextSearches);
    window.localStorage.setItem(
      RECENT_SEARCHES_STORAGE_KEY,
      JSON.stringify(nextSearches),
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      event.preventDefault();
      return;
    }

    rememberSearch(normalizedQuery);
    setIsDropdownOpen(false);
  }

  function handleRecentSearchClick(searchQuery: string) {
    const normalizedQuery = searchQuery.trim();
    setQuery(normalizedQuery);
    rememberSearch(normalizedQuery);
    setIsDropdownOpen(false);

    startTransition(() => {
      if (normalizedQuery === defaultQuery.trim()) {
        router.refresh();
        return;
      }

      const searchParams = new URLSearchParams();
      Object.entries(hiddenFields).forEach(([name, value]) => {
        if (value) searchParams.set(name, value);
      });
      searchParams.set("q", normalizedQuery);
      router.push(`/zombie-projects?${searchParams.toString()}`, {
        scroll: false,
      });
    });
  }

  function handleFocusLeave(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsDropdownOpen(false);
    }
  }

  function handleSearchInputFocus() {
    setRecentSearches(
      addRecentSearch(readRecentSearches(), defaultQuery),
    );
    setIsDropdownOpen(true);
  }

  const hasRecentSearches = isDropdownOpen && recentSearches.length > 0;
  const resetParams = new URLSearchParams();
  Object.entries(hiddenFields).forEach(([name, value]) => {
    if (value) resetParams.set(name, value);
  });
  const resetQueryString = resetParams.toString();
  const resetHref = resetQueryString
    ? `/zombie-projects?${resetQueryString}`
    : "/zombie-projects";

  return (
    <section
      className="mt-9 border-y border-slate-300 bg-white px-5 py-6 sm:px-6"
      aria-labelledby="zombie-project-search-heading"
      onBlur={handleFocusLeave}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="zombie-project-search-heading"
            className="text-lg font-bold text-slate-950"
          >
            프로젝트 이름 검색
          </h2>
          <p
            id="zombie-project-search-description"
            className="mt-2 text-sm leading-6 text-slate-600"
          >
            입력한 문자열이 프로젝트명에 포함된 결과를 찾습니다.
          </p>
        </div>
        {defaultQuery ? (
          <Link
            href={resetHref}
            className="text-sm font-bold text-brand underline decoration-brand-accent underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
          >
            검색 초기화
          </Link>
        ) : null}
      </div>

      <div className="relative mt-5 max-w-3xl">
        <Form
          action="/zombie-projects"
          scroll={false}
          role="search"
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border border-slate-300 bg-white p-2 focus-within:border-brand-accent focus-within:ring-2 focus-within:ring-brand-soft"
        >
          {Object.entries(hiddenFields).map(([name, value]) =>
            value ? (
              <input key={name} type="hidden" name={name} value={value} />
            ) : null,
          )}
          <input
            id="zombie-project-search"
            type="search"
            name="q"
            required
            pattern={String.raw`.*\S.*`}
            title="공백이 아닌 검색어를 입력해 주세요."
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={handleSearchInputFocus}
            aria-describedby="zombie-project-search-description"
            aria-controls={hasRecentSearches ? "recent-zombie-searches" : undefined}
            placeholder="프로젝트 이름을 입력해 주세요"
            className="h-12 min-w-0 flex-1 px-4 text-base text-slate-950 outline-none placeholder:text-slate-500"
          />
          <SearchSubmitButton isNavigationPending={isNavigationPending} />
        </Form>

        {hasRecentSearches ? (
          <div
            id="recent-zombie-searches"
            className="absolute inset-x-0 top-full z-20 mt-2 border border-slate-300 bg-white shadow-sm"
          >
            <p className="border-b border-slate-200 px-4 py-2 text-xs font-bold text-slate-600">
              최근 검색어
            </p>
            <ul>
              {recentSearches.map((recentSearch) => (
                <li key={recentSearch}>
                  <button
                    type="button"
                    onClick={() => handleRecentSearchClick(recentSearch)}
                    className="min-h-11 w-full cursor-pointer px-4 py-2 text-left text-sm text-slate-800 transition-colors hover:bg-brand-canvas focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-accent motion-reduce:transition-none"
                  >
                    {recentSearch}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

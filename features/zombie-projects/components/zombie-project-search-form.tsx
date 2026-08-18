"use client";

import Form from "next/form";
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
      className="flex h-12 min-w-28 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md bg-brand px-6 text-sm font-bold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
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

      const searchParams = new URLSearchParams({ q: normalizedQuery });
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

  return (
    <div className="mt-8" onBlur={handleFocusLeave}>
      <label
        htmlFor="zombie-project-search"
        className="text-sm font-bold text-[#24445f]"
      >
        프로젝트 이름 검색
      </label>
      <p id="zombie-project-search-description" className="mt-1 text-sm text-[#60778b]">
        입력한 문자열이 프로젝트명에 포함된 결과를 찾습니다.
      </p>

      <div className="relative mt-3">
        <Form
          action="/zombie-projects"
          scroll={false}
          role="search"
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border border-[#b8cbd9] bg-white p-2 focus-within:border-brand-accent focus-within:ring-2 focus-within:ring-brand-soft"
        >
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
            className="h-12 min-w-0 flex-1 px-4 text-base text-[#102a43] outline-none placeholder:text-[#778b9d]"
          />
          <SearchSubmitButton isNavigationPending={isNavigationPending} />
        </Form>

        {hasRecentSearches ? (
          <div
            id="recent-zombie-searches"
            className="absolute inset-x-0 top-full z-20 mt-2 border border-[#b8cbd9] bg-white shadow-sm"
          >
            <p className="border-b border-[#e0e8ee] px-4 py-2 text-xs font-bold text-[#60778b]">
              최근 검색어
            </p>
            <ul>
              {recentSearches.map((recentSearch) => (
                <li key={recentSearch}>
                  <button
                    type="button"
                    onClick={() => handleRecentSearchClick(recentSearch)}
                    className="min-h-11 w-full cursor-pointer px-4 py-2 text-left text-sm text-[#294963] transition-colors hover:bg-brand-canvas focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-accent motion-reduce:transition-none"
                  >
                    {recentSearch}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

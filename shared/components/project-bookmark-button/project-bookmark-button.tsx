"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useAuthSession from "@/shared/auth/hooks/use-auth-session";
import LoadingSpinner from "@/shared/components/loading-spinner/loading-spinner";
import { toggleProjectBookmark } from "@/shared/project-summary/api/toggle-project-bookmark";
import { getBookmarkedProjectIds } from "@/shared/project-summary/api/get-bookmarked-project-ids";
import { queryKeys } from "@/shared/query/query-keys";

interface ProjectBookmarkButtonProps {
  projectId: number;
  projectName: string;
  initialBookmarked: boolean;
  returnPath: string;
  errorPlacement?: "inline" | "floating";
}

export default function ProjectBookmarkButton({
  projectId,
  projectName,
  initialBookmarked,
  returnPath,
  errorPlacement = "inline",
}: ProjectBookmarkButtonProps) {
  const { user, isInitialized } = useAuthSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [bookmarkedOverride, setBookmarkedOverride] = useState<boolean | null>(null);
  const viewerQuery = useQuery({
    queryKey: queryKeys.mypage.wishlistIds,
    queryFn: getBookmarkedProjectIds,
    enabled: Boolean(user),
  });
  const bookmarked = bookmarkedOverride ?? viewerQuery.data?.has(projectId) ?? initialBookmarked;
  const mutation = useMutation({
    mutationFn: () => toggleProjectBookmark(projectId),
    retry: false,
    onSuccess: (result) => {
      setBookmarkedOverride(result.bookmarked);
      void queryClient.invalidateQueries({ queryKey: queryKeys.mypage.wishlist });
      void queryClient.invalidateQueries({ queryKey: queryKeys.mypage.wishlistIds });
      void queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });

  const handleClick = () => {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(returnPath)}`);
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="relative inline-flex flex-col items-start">
      <button
        type="button"
        aria-pressed={bookmarked}
        aria-label={`${projectName} 관심 프로젝트 ${bookmarked ? "저장 취소" : "저장"}`}
        aria-busy={mutation.isPending}
        title={bookmarked ? "관심 프로젝트 저장 취소" : "관심 프로젝트 저장"}
        onClick={handleClick}
        disabled={!isInitialized || mutation.isPending}
        className={`inline-flex h-11 w-11 shrink-0 items-center justify-center border bg-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none ${
          bookmarked
            ? "border-brand text-brand"
            : "border-slate-300 text-slate-700 hover:border-brand hover:text-brand"
        }`}
      >
        {mutation.isPending ? (
          <LoadingSpinner size={18} />
        ) : (
          <Star
            aria-hidden="true"
            size={21}
            strokeWidth={2}
            fill={bookmarked ? "currentColor" : "none"}
          />
        )}
      </button>
      {mutation.isError ? (
        <p
          role="alert"
          className={
            errorPlacement === "floating"
              ? "absolute right-0 top-full z-20 mt-2 w-56 border border-red-200 bg-white px-3 py-2 text-left text-xs leading-5 text-red-700"
              : "mt-2 max-w-56 text-xs leading-5 text-red-700"
          }
        >
          {mutation.error.message}
        </p>
      ) : null}
    </div>
  );
}

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  fullWidth?: boolean;
}

export default function ProjectBookmarkButton({
  projectId,
  projectName,
  initialBookmarked,
  returnPath,
  fullWidth = false,
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
    <div
      className={
        fullWidth
          ? "relative flex w-full flex-col items-stretch"
          : "relative inline-flex flex-col items-start"
      }
    >
      <button
        type="button"
        aria-pressed={bookmarked}
        aria-label={`${projectName} 관심 프로젝트 ${bookmarked ? "저장 취소" : "저장"}`}
        aria-busy={mutation.isPending}
        title={bookmarked ? "관심 프로젝트 저장 취소" : "관심 프로젝트 저장"}
        onClick={handleClick}
        disabled={!isInitialized || mutation.isPending}
        className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 border px-4 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none ${
          fullWidth ? "w-full" : ""
        } ${
          bookmarked
            ? "border-brand bg-brand text-white hover:bg-brand-hover"
            : "border-slate-300 bg-white text-brand hover:border-brand hover:bg-brand-canvas"
        }`}
      >
        {mutation.isPending ? <LoadingSpinner size={16} /> : null}
        <span>
          {mutation.isPending
            ? "즐겨찾기 변경 중"
            : bookmarked
              ? "즐겨찾기 해제"
              : "프로젝트 즐겨찾기"}
        </span>
      </button>
      {mutation.isError ? (
        <p role="alert" className="mt-2 max-w-56 text-xs leading-5 text-red-700">
          {mutation.error.message}
        </p>
      ) : null}
    </div>
  );
}

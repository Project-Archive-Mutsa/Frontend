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
}

export default function ProjectBookmarkButton({
  projectId,
  projectName,
  initialBookmarked,
  returnPath,
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
    <div>
      <button
        type="button"
        aria-pressed={bookmarked}
        aria-label={`${projectName} ${bookmarked ? "북마크 취소" : "북마크 추가"}`}
        onClick={handleClick}
        disabled={!isInitialized || mutation.isPending}
        className="inline-flex min-h-10 items-center justify-center gap-2 border border-slate-300 px-3 text-xs font-bold text-slate-700 hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
      >
        {mutation.isPending ? <LoadingSpinner size={14} /> : null}
        {bookmarked ? "저장됨" : "관심 프로젝트 저장"}
      </button>
      {mutation.isError ? (
        <p role="alert" className="mt-2 text-xs leading-5 text-red-700">
          {mutation.error.message}
        </p>
      ) : null}
    </div>
  );
}

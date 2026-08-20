"use client";

import useLogout from "@/shared/auth/hooks/use-logout";
import LoadingSpinner from "@/shared/components/loading-spinner/loading-spinner";

export default function LogoutButton() {
  const logoutMutation = useLogout();

  return (
    <div className="relative">
      <button
        type="button"
        disabled={logoutMutation.isPending}
        aria-describedby={
          logoutMutation.isError ? "header-logout-error" : undefined
        }
        onClick={() => logoutMutation.mutate()}
        className="flex min-h-10 items-center gap-1.5 rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-[#e7f2fc] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-wait disabled:opacity-60 sm:text-sm"
      >
        {logoutMutation.isPending ? <LoadingSpinner size={14} /> : null}
        <span>로그아웃</span>
      </button>

      {logoutMutation.isError ? (
        <p
          id="header-logout-error"
          role="alert"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-10 w-64 rounded-md border border-red-200 bg-white px-3 py-2 text-xs font-medium leading-5 text-red-700 shadow-sm"
        >
          {logoutMutation.error.message}
        </p>
      ) : null}
    </div>
  );
}

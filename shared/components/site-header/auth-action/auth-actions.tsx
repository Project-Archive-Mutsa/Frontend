"use client";

import Link from "next/link";
import useAuthSession from "@/shared/auth/hooks/use-auth-session";
import LoginButton from "./components/login-button";
import RegisterButton from "./components/register-button";

const AUTHENTICATED_ACTION_CLASS_NAME =
  "rounded-lg px-3 py-2 text-xs font-semibold text-[#e7f2fc] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-sm";

export default function AuthActions() {
  const { isInitialized, user } = useAuthSession();

  return (
    <nav
      aria-label="회원 메뉴"
      aria-busy={!isInitialized}
      className="ml-auto flex min-h-10 min-w-52 shrink-0 items-center justify-end gap-2"
    >
      {isInitialized ? (
        user ? (
          <>
            <Link href="/mypage" className={AUTHENTICATED_ACTION_CLASS_NAME}>
              마이페이지
            </Link>
            <Link
              href="/project-register"
              className={AUTHENTICATED_ACTION_CLASS_NAME}
            >
              프로젝트 등록
            </Link>
          </>
        ) : (
          <>
            <LoginButton />
            <RegisterButton />
          </>
        )
      ) : null}
    </nav>
  );
}

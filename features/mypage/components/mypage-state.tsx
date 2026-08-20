import Link from "next/link";
import SectionLoadingSpinner from "@/shared/components/section-loading-spinner/section-loading-spinner";

export function MypageLoading() {
  return <SectionLoadingSpinner />;
}

export function MypageLoginRequired({
  nextPath = "/mypage",
}: {
  nextPath?: string;
}) {
  return (
    <div className="border-y border-slate-300 bg-white px-6 py-10 text-center">
      <p className="text-sm text-slate-600">로그인 후 확인할 수 있습니다.</p>
      <Link
        href={`/login?next=${encodeURIComponent(nextPath)}`}
        className="mt-5 inline-flex min-h-11 items-center bg-brand px-5 text-sm font-bold text-white"
      >
        로그인
      </Link>
    </div>
  );
}

export function MypageError({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="border-y border-red-300 bg-red-50 px-5 py-4 text-sm text-red-800"
    >
      {message}
    </p>
  );
}

export function MypageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="border-b border-slate-300 pb-7">
      <nav aria-label="현재 위치">
        <Link
          href="/mypage"
          className="text-xs font-bold text-brand underline decoration-brand-accent underline-offset-4"
        >
          마이페이지
        </Link>
      </nav>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-[-0.025em] text-slate-950">
        {title}
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </header>
  );
}

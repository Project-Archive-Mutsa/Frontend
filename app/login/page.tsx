import Link from "next/link";
import LoginSection from "@/features/login/components/login-section";

export default function LoginPage() {
  return (
    <main className="bg-brand-canvas flex flex-1 items-center justify-center px-8 py-8 xl:px-12 xl:py-10 2xl:py-12">
      <section className="grid min-h-[32rem] w-full max-w-5xl grid-cols-[0.9fr_1.1fr] overflow-hidden rounded-2xl border border-slate-200 bg-white 2xl:max-w-6xl">
        <aside className="bg-brand-soft text-brand flex flex-col justify-between px-10 py-10 2xl:px-12 2xl:py-12">
          <div>
            <p className="font-[Georgia] text-5xl leading-none font-bold tracking-[-0.04em]">
              Project
              <br />
              Archive
            </p>
            <div className="bg-brand-accent mt-6 h-1 w-10" />
            <p className="mt-6 max-w-sm text-2xl leading-8 font-bold tracking-[-0.03em]">
              과거 프로젝트를 찾고, 멈춘 결과물의 다음 가능성을 확인하세요.
            </p>
            <p className="mt-3 max-w-sm text-base leading-7 text-slate-600">
              아이디어를 검색하고 관심 있는 프로젝트를 저장할 수 있습니다.
            </p>
          </div>

          <div className="mt-8 border-t border-slate-400/50 pt-5 text-sm text-slate-600">
            <p>아직 계정이 없나요?</p>
            <Link
              href="/register"
              className="text-brand hover:text-brand-accent mt-1 inline-flex min-h-8 items-center font-bold underline decoration-2 underline-offset-4 transition-colors focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
            >
              회원가입
            </Link>
          </div>
        </aside>

        <div className="flex items-center px-10 py-10 2xl:px-14 2xl:py-12">
          <div className="mx-auto w-full max-w-md">
            <LoginSection />
          </div>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import LoginSection from "@/features/login/components/login-section";

export default function LoginPage() {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#eef4f8] px-10 py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(86,159,216,0.14),transparent_30%),radial-gradient(circle_at_88%_84%,rgba(18,63,112,0.07),transparent_28%)]"
      />

      <section className="relative grid min-h-[580px] w-full max-w-5xl grid-cols-[0.92fr_1.08fr] overflow-hidden rounded-[1.75rem] border border-[#d7e3ed] bg-white shadow-[0_28px_72px_-42px_rgba(16,42,67,0.46)]">
        <aside className="flex flex-col justify-between bg-[#dce9f4] px-14 py-14 text-[#123f70]">
          <div>
            <p className="font-[Georgia] text-[3.5rem] leading-[0.95] font-bold tracking-[-0.045em] text-[#123f70]">
              Project
              <br />
              Archive
            </p>
            <div className="mt-8 h-1 w-10 rounded-full bg-[#4f8fbd]" />
            <p className="mt-8 max-w-sm text-2xl leading-[1.35] font-bold tracking-[-0.035em]">
              프로젝트의 다음 가능성을 이어갑니다.
            </p>
            <p className="mt-4 max-w-sm text-base leading-7 text-[#4f6880]">
              로그인하고 새로운 아이디어와 다시 이어질 프로젝트를 살펴보세요.
            </p>
          </div>

          <div className="mt-12 border-t border-[#b8ccdc] pt-6 text-sm text-[#4f6880]">
            <p>아직 계정이 없나요?</p>
            <Link
              href="/register"
              className="mt-1 inline-flex min-h-8 cursor-pointer items-center font-bold text-[#123f70] underline decoration-[#6e9fc3] decoration-2 underline-offset-4 transition-colors hover:text-[#2f79b9] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f79b9]"
            >
              회원가입
            </Link>
          </div>
        </aside>

        <div className="flex items-center px-16 py-14">
          <div className="mx-auto w-full max-w-md">
            <LoginSection />
          </div>
        </div>
      </section>
    </main>
  );
}

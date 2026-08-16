import Link from "next/link";

export default function LoginButton() {
  return (
    <Link
      href="/login"
      className="rounded-lg px-3 py-2 text-xs font-semibold text-[#e7f2fc] transition-colors hover:bg-white/10 hover:text-white sm:text-sm"
    >
      로그인
    </Link>
  );
}

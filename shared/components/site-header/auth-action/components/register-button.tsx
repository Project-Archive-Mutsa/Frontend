import Link from "next/link";

export default function RegisterButton() {
  return (
    <Link
      href="/register"
      className="rounded-lg px-3 py-2 text-xs font-semibold text-[#e7f2fc] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-sm"
    >
      회원가입
    </Link>
  );
}

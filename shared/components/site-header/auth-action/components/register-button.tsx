import Link from "next/link";

export default function RegisterButton() {
  return (
    <Link
      href="/register"
      className="rounded-xl bg-[#64b5ed] px-3.5 py-2.5 text-xs font-bold text-[#0f3b64] shadow-[0_8px_20px_-12px_rgba(100,181,237,0.9)] transition-colors hover:bg-[#83c8f5] sm:text-sm"
    >
      회원가입
    </Link>
  );
}

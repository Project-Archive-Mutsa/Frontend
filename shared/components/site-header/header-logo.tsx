import Link from "next/link";

export default function HeaderLogo() {
  return (
    <Link
      href="/"
      aria-label="Project Archive 홈"
      className="shrink-0 font-[Georgia] text-lg leading-[0.95] font-bold tracking-[-0.03em] text-white sm:text-xl"
    >
      Project
      <br />
      Archive
    </Link>
  );
}

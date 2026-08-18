import Link from "next/link";

export default function HeaderLogo() {
  return (
    <Link
      href="/"
      aria-label="Project Archive 홈"
      className="font-display shrink-0 text-xl leading-[0.95] font-bold tracking-[-0.025em] text-white sm:text-2xl"
    >
      Project
      <br />
      Archive
    </Link>
  );
}

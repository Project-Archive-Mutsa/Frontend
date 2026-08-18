import type { Metadata } from "next";
import ZombieProjectSection from "@/features/zombie-projects/components/zombie-project-section";

export const metadata: Metadata = {
  title: "중단 프로젝트 | Project Archive",
  description:
    "후속 개발이나 협업으로 이어갈 수 있는 중단 프로젝트를 살펴보세요.",
};

interface ZombieProjectPageProps {
  searchParams: Promise<{
    q?: string | string[];
  }>;
}

export default async function ZombieProjectPage({
  searchParams,
}: ZombieProjectPageProps) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";

  return (
    <main className="flex flex-1 bg-brand-canvas">
      <ZombieProjectSection query={query} />
    </main>
  );
}

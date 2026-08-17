import ProjectDiscoverySection from "@/features/project-discovery/components/project-discovery-section";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string | string[];
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";

  return (
    <main className="min-h-dvh bg-[#f7fafc]">
      <ProjectDiscoverySection query={query} />
    </main>
  );
}

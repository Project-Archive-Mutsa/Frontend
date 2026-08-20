import { permanentRedirect } from "next/navigation";

export default async function LegacyProjectMarketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  permanentRedirect(`/projects/${id}`);
}

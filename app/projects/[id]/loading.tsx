import SectionLoadingSpinner from "@/shared/components/section-loading-spinner/section-loading-spinner";

export default function ProjectDetailLoading() {
  return (
    <main className="flex min-h-[36rem] flex-1 bg-slate-50">
      <SectionLoadingSpinner />
    </main>
  );
}

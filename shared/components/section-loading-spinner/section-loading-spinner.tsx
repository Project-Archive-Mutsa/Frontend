import LoadingSpinner from "@/shared/components/loading-spinner/loading-spinner";

export default function SectionLoadingSpinner() {
  return (
    <div
      className="flex min-h-40 w-full items-center justify-center"
      role="status"
    >
      <LoadingSpinner />
      <span className="sr-only">콘텐츠를 불러오는 중입니다.</span>
    </div>
  );
}

import type { ProjectDiscoveryResultItem } from "@/features/project-discovery/types";
import ProjectDiscoveryResultItemComponent from "./project-discovery-result-item";

interface ProjectDiscoveryResultListProps {
  id: string;
  title: string;
  description: string;
  items: readonly ProjectDiscoveryResultItem[];
}

const INITIAL_RESULT_COUNT = 5;

export default function ProjectDiscoveryResultList({
  id,
  title,
  description,
  items,
}: ProjectDiscoveryResultListProps) {
  const initialItems = items.slice(0, INITIAL_RESULT_COUNT);
  const remainingItems = items.slice(INITIAL_RESULT_COUNT);

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <header className="mb-6 flex flex-col gap-2 border-b border-brand-soft pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id={`${id}-title`}
            className="text-2xl font-bold tracking-[-0.03em] text-[#102a43] sm:text-3xl"
          >
            {title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#687f94]">{description}</p>
        </div>
        <p className="text-sm font-semibold tabular-nums text-[#315978]">
          {items.length.toLocaleString("ko-KR")}건
        </p>
      </header>

      {items.length > 0 ? (
        <>
          <ul className="divide-y divide-brand-soft border-y border-brand-soft">
            {initialItems.map((item) => (
              <li key={`${item.type}-${item.id}`}>
                <ProjectDiscoveryResultItemComponent item={item} />
              </li>
            ))}
          </ul>

          {remainingItems.length > 0 ? (
            <details className="group border-b border-brand-soft">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-center px-4 text-sm font-semibold text-[#315978] transition-colors hover:bg-brand-canvas focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand [&::-webkit-details-marker]:hidden">
                <span className="group-open:hidden">
                  나머지 {remainingItems.length.toLocaleString("ko-KR")}개 더보기
                </span>
                <span className="hidden group-open:inline">검색 결과 접기</span>
              </summary>
              <ul className="divide-y divide-brand-soft border-t border-brand-soft">
                {remainingItems.map((item) => (
                  <li key={`${item.type}-${item.id}`}>
                    <ProjectDiscoveryResultItemComponent item={item} />
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
        </>
      ) : (
        <p className="border-y border-brand-soft py-12 text-center text-sm text-[#687f94]">
          검색된 {title}이 없습니다.
        </p>
      )}
    </section>
  );
}

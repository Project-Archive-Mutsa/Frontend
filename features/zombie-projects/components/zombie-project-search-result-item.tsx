import { formatFileSize } from "@/features/zombie-projects/lib/format-file-size";
import type {
  ZombieProjectSearchFile,
  ZombieProjectSearchResult,
} from "@/features/zombie-projects/types";

interface ZombieProjectSearchResultItemProps {
  project: ZombieProjectSearchResult;
}

interface AnalysisSectionProps {
  title: string;
  items: readonly string[];
}

function AnalysisSection({ title, items }: AnalysisSectionProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section>
      <h3 className="text-sm font-bold text-[#294963]">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-[#5d7285]">
        {items.map((item, index) => (
          <li key={`${item}-${index}`} className="flex gap-3">
            <span
              aria-hidden="true"
              className="mt-3 h-px w-3 shrink-0 bg-brand-accent"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function getFileType(file: ZombieProjectSearchFile) {
  const extension = file.extension.trim();
  const kind = file.kind.trim();

  return [extension ? `.${extension.replace(/^\./, "")}` : "", kind]
    .filter(Boolean)
    .join(" · ");
}

export default function ZombieProjectSearchResultItem({
  project,
}: ZombieProjectSearchResultItemProps) {
  const analysisSections = [
    { title: "차별화 요소", items: project.differentiators },
    { title: "기술적 강점", items: project.technicalStrengths },
    { title: "발전 방향", items: project.futureDirections },
    ...project.sections,
  ];

  return (
    <article className="py-8 sm:py-10">
      <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="break-all text-2xl font-bold tracking-[-0.035em] text-[#173a59]">
          {project.projectTitle}
        </h2>
        <p className="shrink-0 text-sm text-[#63788c]">
          전체 파일 {project.totalFiles.toLocaleString("ko-KR")}개
        </p>
      </header>

      <section className="mt-6 border-y border-[#c5d4df] py-5">
        <h3 className="text-xs font-bold text-[#52697d]">프로젝트가 하는 일</h3>
        {project.functionalSummary.length > 0 ? (
          <ul className="mt-2 space-y-2 text-base font-medium leading-7 text-[#24445f]">
            {project.functionalSummary.map((summary, index) => (
              <li key={`${summary}-${index}`}>{summary}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-[#6b7f91]">
            제공된 기능 요약이 없습니다.
          </p>
        )}
      </section>

      {analysisSections.some((section) => section.items.length > 0) ? (
        <div className="mt-8 grid gap-x-10 gap-y-8 border-t border-[#dbe5ed] pt-7 lg:grid-cols-2">
          {analysisSections.map((section, index) => (
            <AnalysisSection
              key={`${section.title}-${index}`}
              title={section.title}
              items={section.items}
            />
          ))}
        </div>
      ) : null}

      <section className="mt-8 border-t border-[#dbe5ed] pt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-sm font-bold text-[#294963]">분석에 사용된 파일</h3>
          <p className="text-xs text-[#6b7f91]">
            선택 파일 {project.selectedFiles.length.toLocaleString("ko-KR")}개
          </p>
        </div>

        {project.selectedFiles.length > 0 ? (
          <ul className="mt-3 divide-y divide-[#e2e9ee] border-y border-[#e2e9ee]">
            {project.selectedFiles.map((file, index) => (
              <li
                key={`${file.path}-${index}`}
                className="grid gap-1 py-3 text-sm sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6"
              >
                <span className="min-w-0 break-all font-medium text-[#405b71]">
                  {file.path}
                </span>
                <span className="text-xs text-[#6b7f91] sm:text-right">
                  {getFileType(file) || "파일 형식 미분류"} ·{" "}
                  {formatFileSize(file.size)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 border-y border-[#e2e9ee] py-5 text-sm text-[#6b7f91]">
            분석 파일 정보가 없습니다.
          </p>
        )}
      </section>
    </article>
  );
}

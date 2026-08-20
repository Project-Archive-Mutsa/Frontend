"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjectDetailedInfoFiles } from "../api/get-project-detailed-info-files";
import { getProjectReportAccess } from "../api/get-project-report-access";
import { getProjectReport } from "../api/get-project-report";
import { getAssetTypeLabel } from "../lib/format-project-detail";
import type { ProjectDetailViewModel } from "../model/types";
import useAuthSession from "@/shared/auth/hooks/use-auth-session";
import LoadingSpinner from "@/shared/components/loading-spinner/loading-spinner";
import SectionLoadingSpinner from "@/shared/components/section-loading-spinner/section-loading-spinner";
import { queryKeys } from "@/shared/query/query-keys";
import ProjectReportFileButton from "./project-report-file-button";

const DEFAULT_OUTLINE = [
  "문제 상황과 대상",
  "해결 방법과 핵심 기능",
  "차별점과 검증",
  "제약·한계와 후속 과제",
] as const;

function DetailedInfoHeader() {
  return (
    <div className="border-b border-slate-300 pb-5">
      <p className="text-xs font-bold text-brand">권한 보유 사용자만 열람</p>
      <h2
        id="project-detailed-info-title"
        className="font-display mt-2 text-2xl font-bold tracking-[-0.025em] text-slate-950"
      >
        프로젝트 상세 정보
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        상세 정보 열람은 프로젝트 자산의 사용권·소유권·양도 권리를 제공하지
        않습니다.
      </p>
    </div>
  );
}

function RetryState({
  message,
  isRetrying,
  onRetry,
}: {
  message: string;
  isRetrying: boolean;
  onRetry: () => void;
}) {
  return (
    <div className="py-8">
      <p role="alert" className="text-sm leading-7 text-red-700">
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 border border-slate-400 bg-white px-5 text-sm font-bold text-slate-900 hover:bg-slate-100 disabled:cursor-wait disabled:text-slate-500"
      >
        {isRetrying ? <LoadingSpinner size={16} /> : null}
        {isRetrying ? "다시 불러오는 중" : "프로젝트 상세 정보 다시 불러오기"}
      </button>
    </div>
  );
}

export default function ProjectReportSection({
  project,
}: {
  project: ProjectDetailViewModel;
}) {
  const { user, isInitialized } = useAuthSession();
  const pointAccessAvailable =
    project.registrationPurpose === "ZOMBIE" && project.reportOffer.available;
  const accessQuery = useQuery({
    queryKey: queryKeys.projects.reportAccess(project.id),
    queryFn: ({ signal }) => getProjectReportAccess(project.id, signal),
    enabled: Boolean(user),
    retry: false,
  });
  const hasAccess =
    accessQuery.data?.status === "GRANTED" ||
    accessQuery.data?.status === "OWNER";
  const reportQuery = useQuery({
    queryKey: queryKeys.projects.report(project.id),
    queryFn: ({ signal }) => getProjectReport(project.id, signal),
    enabled: hasAccess,
    retry: false,
  });
  const filesQuery = useQuery({
    queryKey: queryKeys.projects.detailedInfoFiles(project.id),
    queryFn: ({ signal }) => getProjectDetailedInfoFiles(project.id, signal),
    enabled: hasAccess,
    retry: false,
  });
  const outline = project.reportOffer.sectionTitles.length
    ? project.reportOffer.sectionTitles
    : DEFAULT_OUTLINE;
  const isAccessChecking = Boolean(
    user && accessQuery.isPending && accessQuery.fetchStatus === "fetching",
  );
  const isContentLoading = Boolean(
    hasAccess &&
      ((reportQuery.isPending && reportQuery.fetchStatus === "fetching") ||
        (filesQuery.isPending && filesQuery.fetchStatus === "fetching")),
  );

  if (!isInitialized || isAccessChecking) {
    return (
      <section
        id="project-detailed-info"
        aria-labelledby="project-detailed-info-title"
        className="border-t border-slate-300 pt-10"
      >
        <DetailedInfoHeader />
        <SectionLoadingSpinner />
      </section>
    );
  }

  if (!user && !pointAccessAvailable) {
    return null;
  }

  if (accessQuery.isError) {
    return (
      <section
        id="project-detailed-info"
        aria-labelledby="project-detailed-info-title"
        className="border-t border-slate-300 pt-10"
      >
        <DetailedInfoHeader />
        <RetryState
          message={accessQuery.error.message}
          isRetrying={accessQuery.isFetching}
          onRetry={() => void accessQuery.refetch()}
        />
      </section>
    );
  }

  if (!hasAccess && !pointAccessAvailable) {
    return null;
  }

  return (
    <section
      id="project-detailed-info"
      aria-labelledby="project-detailed-info-title"
      className="border-t border-slate-300 pt-10"
    >
      <DetailedInfoHeader />

      {isContentLoading ? (
        <SectionLoadingSpinner />
      ) : hasAccess && (reportQuery.isError || filesQuery.isError) ? (
        <RetryState
          message={
            reportQuery.error?.message ??
            filesQuery.error?.message ??
            "프로젝트 상세 정보를 불러오지 못했습니다."
          }
          isRetrying={reportQuery.isFetching || filesQuery.isFetching}
          onRetry={() => {
            void Promise.all([reportQuery.refetch(), filesQuery.refetch()]);
          }}
        />
      ) : hasAccess && reportQuery.data && filesQuery.data ? (
        <div className="divide-y divide-slate-200">
          {reportQuery.data.sections.map((section) => {
            const files = filesQuery.data.filter(
              (file) => file.pageId === section.detailPageId,
            );
            return (
              <article key={section.detailPageId} className="py-9">
                <h3 className="font-display text-xl font-bold text-slate-950">
                  {section.title}
                </h3>
                {section.intro ? (
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {section.intro}
                  </p>
                ) : null}
                {section.content ? (
                  <div className="mt-5 whitespace-pre-line text-sm leading-8 text-slate-700">
                    {section.content}
                  </div>
                ) : null}
                {files.length ? (
                  <ul className="mt-6 divide-y divide-slate-200 border-y border-slate-300">
                    {files.map((file) => (
                      <li
                        key={file.id}
                        className="flex items-start justify-between gap-6 py-4"
                      >
                        <div className="min-w-0">
                          <p className="break-words text-sm font-bold text-slate-900">
                            {file.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {getAssetTypeLabel(file.assetType)}
                          </p>
                        </div>
                        <ProjectReportFileButton
                          projectId={project.id}
                          fileId={file.id}
                        />
                      </li>
                    ))}
                  </ul>
                ) : section.assetCount > 0 ? (
                  <p className="mt-5 text-xs text-slate-500">
                    첨부 자산 {section.assetCount}개
                  </p>
                ) : null}
              </article>
            );
          })}
          {reportQuery.data.links.length ? (
            <section className="py-9" aria-labelledby="detailed-info-links-title">
              <h3
                id="detailed-info-links-title"
                className="font-display text-xl font-bold text-slate-950"
              >
                연결 자료
              </h3>
              <ul className="mt-5 space-y-3 text-sm">
                {reportQuery.data.links.map((link) => (
                  <li key={link.linkId}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-brand underline decoration-brand-accent underline-offset-4"
                    >
                      {link.linkType} 자료 열기
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : (
        <div className="bg-brand-canvas px-6 py-8 sm:px-8">
          <h3 className="font-display text-xl font-bold text-slate-950">
            열람 후 확인할 수 있는 내용
          </h3>
          <ol className="mt-6 grid list-decimal gap-x-10 gap-y-4 pl-5 text-sm leading-6 text-slate-700 sm:grid-cols-2">
            {outline.map((title, index) => (
              <li key={`${title}-${index}`} className="pl-1">
                {title}
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}

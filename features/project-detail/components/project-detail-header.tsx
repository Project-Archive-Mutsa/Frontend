import Image from "next/image";
import Link from "next/link";
import ProjectInformationCompleteness from "@/shared/components/project-information-completeness/project-information-completeness";
import ProjectBookmarkButton from "@/shared/components/project-bookmark-button/project-bookmark-button";
import {
  getProjectActivityStatusLabel,
  getProjectPurposeLabel,
  getProjectResultLevelLabel,
} from "@/shared/project-summary/types";
import type { ProjectDetailViewModel } from "../model/types";
import { formatProjectDate } from "../lib/format-project-detail";

interface ProjectDetailHeaderProps {
  project: ProjectDetailViewModel;
}

export default function ProjectDetailHeader({ project }: ProjectDetailHeaderProps) {
  const context = [
    getProjectPurposeLabel(project.registrationPurpose) ?? "등록 목적 연동 전",
    project.event?.name ?? "출품 행사 연동 전",
    project.registeredAt ? `${formatProjectDate(project.registeredAt)} 등록` : null,
  ].filter((value): value is string => Boolean(value));
  const tags = [
    ...new Set([
      ...project.categories,
      ...project.problemAreas,
      ...project.methods,
      ...project.tags,
    ]),
  ];

  return (
    <header>
      <nav aria-label="현재 위치" className="text-xs text-slate-500">
        <ol className="flex items-center gap-2">
          <li>
            <Link
              href="/projects"
              className="underline decoration-slate-300 underline-offset-4 hover:text-brand hover:decoration-brand"
            >
              프로젝트 탐색
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="truncate">
            프로젝트 기록
          </li>
        </ol>
      </nav>

      <div className="mt-8 grid gap-10 border-b border-slate-300 pb-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-14">
        <div className="min-w-0 self-end">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
            {context.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <h1 className="font-display mt-4 max-w-4xl text-pretty break-keep text-4xl font-bold tracking-[-0.035em] text-slate-950 [overflow-wrap:anywhere] lg:text-5xl lg:leading-[1.2]">
            {project.name}
          </h1>
          <p className="mt-6 max-w-4xl overflow-hidden text-pretty break-keep text-base leading-8 text-slate-600 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] [overflow-wrap:anywhere]">
            {project.summary}
          </p>

          {tags.length > 0 ? (
            <ul
              className="mt-7 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600"
              aria-label={`${project.name} 분류: ${tags.join(", ")}`}
            >
              {tags.slice(0, 10).map((tag) => (
                <li key={tag} className="border-b border-brand-accent pb-0.5">
                  {tag}
                </li>
              ))}
              {tags.length > 10 ? <li>외 {tags.length - 10}개</li> : null}
            </ul>
          ) : null}

          <dl className="mt-8 grid gap-6 border-t border-slate-200 pt-6 sm:grid-cols-3">
            <div>
              <dt className="text-xs text-slate-500">결과물 단계</dt>
              <dd className="mt-1 font-bold text-slate-800">
                {getProjectResultLevelLabel(project.resultLevel)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">현재 활동 상태</dt>
              <dd className="mt-1 font-bold text-slate-800">
                {getProjectActivityStatusLabel(project.activityStatus)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">출품 행사</dt>
              <dd className="mt-1 font-bold text-slate-800">
                {project.event?.name ?? "미입력"}
              </dd>
            </div>
          </dl>
        </div>

        <aside>
          <div className="relative aspect-[4/3] overflow-hidden bg-brand-canvas">
            {project.representativeImageUrl ? (
              <Image
                src={project.representativeImageUrl}
                alt={`${project.name} 대표 이미지`}
                fill
                unoptimized
                priority
                sizes="304px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500">
                대표 이미지 미등록
              </div>
            )}
          </div>
          <div className="mt-6">
            <ProjectInformationCompleteness
              projectName={project.name}
              score={project.informationCompletenessScore}
            />
          </div>
          <div className="mt-5">
            <ProjectBookmarkButton
              projectId={project.id}
              projectName={project.name}
              initialBookmarked={project.viewer.bookmarked}
              returnPath={`/projects/${project.id}`}
            />
          </div>
          {project.registrant ? (
            <dl className="mt-5 border-t border-slate-200 pt-4 text-sm">
              <dt className="text-xs text-slate-500">등록자</dt>
              <dd className="mt-1 font-medium text-slate-800">
                {project.registrant.name}
              </dd>
            </dl>
          ) : null}
        </aside>
      </div>
    </header>
  );
}

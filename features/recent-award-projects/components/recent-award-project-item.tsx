import Image from "next/image";
import type { RecentAwardProject } from "@/features/recent-award-projects/types";
import ProjectInformationCompleteness from "@/shared/components/project-information-completeness/project-information-completeness";
import {
  getProjectActivityStatusLabel,
  getProjectResultLevelLabel,
} from "@/shared/project-summary/types";

interface RecentAwardProjectItemProps {
  project: RecentAwardProject;
}

export default function RecentAwardProjectItem({
  project,
}: RecentAwardProjectItemProps) {
  return (
    <article className="flex h-full flex-col border-y border-slate-300 py-5">
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-canvas">
        {project.representativeImage ? (
          <Image
            src={project.representativeImage.src}
            alt={project.representativeImage.alt}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, 280px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-xs text-slate-500">
            대표 이미지 미등록
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span>{project.category}</span>
          <span className="font-bold text-brand">{project.award.title}</span>
        </div>
        <h3 className="font-display mt-3 text-pretty break-keep text-xl font-semibold tracking-[-0.02em] text-slate-950">
          {project.name}
        </h3>
        <p className="mt-2 line-clamp-3 text-pretty break-keep text-sm leading-6 text-slate-600">
          {project.summary}
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-200 pt-4 text-sm">
          <div>
            <dt className="text-xs text-slate-500">결과물 단계</dt>
            <dd className="mt-1 font-bold text-slate-800">
              {getProjectResultLevelLabel(project.resultLevel)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">활동 상태</dt>
            <dd className="mt-1 font-bold text-slate-800">
              {getProjectActivityStatusLabel(project.activityStatus)}
            </dd>
          </div>
        </dl>

        <div className="mt-5 border-t border-slate-200 pt-4">
          <p className="text-xs font-medium leading-5 text-slate-700">
            {project.award.competitionName}
          </p>
          <time
            dateTime={project.award.awardedAt}
            className="mt-1 block text-xs tabular-nums text-slate-500"
          >
            {project.award.awardedAt} 수상
          </time>
        </div>

        <div className="mt-5 border-t border-slate-200 pt-4">
          <ProjectInformationCompleteness
            projectName={project.name}
            score={project.informationCompletenessScore}
          />
        </div>

        <p className="mt-auto border-t border-slate-200 pt-4 text-xs tabular-nums text-slate-500">
          조회 {project.stats.viewCount.toLocaleString("ko-KR")} · 좋아요{" "}
          {project.stats.likeCount.toLocaleString("ko-KR")}
        </p>
      </div>
    </article>
  );
}

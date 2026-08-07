import Image from "next/image";
import type { RecentAwardProject } from "@/mocks/recent-award-projects/types";

interface RecentAwardProjectItemProps {
  project: RecentAwardProject;
}

export default function RecentAwardProjectItem({
  project,
}: RecentAwardProjectItemProps) {
  return (
    <article className="flex flex-col">
      <p>프로젝트 대표 이미지:</p>
      <Image
        src={project.representativeImage.src}
        alt={project.representativeImage.alt}
        width={400}
        height={240}
      />
      <p>카테고리: {project.category}</p>
      <h3>프로젝트 제목: {project.name}</h3>
      <p>프로젝트 한 줄 소개: {project.summary}</p>
      <p>대회 이름: {project.award.competitionName}</p>
      <p>수상명: {project.award.title}</p>
      <time dateTime={project.award.awardedAt}>
        수상일: {project.award.awardedAt}
      </time>
      {project.techStack ? <p>사용 기술: {project.techStack.join(", ")}</p> : null}
      <p>조회수: {project.stats.viewCount}</p>
      <p>좋아요 수: {project.stats.likeCount}</p>
    </article>
  );
}

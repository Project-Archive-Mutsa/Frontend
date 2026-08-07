import Image from "next/image";
import type { PopularProject } from "@/mocks/popular-projects/types";

interface PopularProjectItemProps {
  project: PopularProject;
}

export default function PopularProjectItem({
  project,
}: PopularProjectItemProps) {
  return (
    <article className="flex w-60 flex-col border">
      <p>프로젝트 대표 이미지:</p>
      <Image
        src={project.representativeImage.src}
        alt={project.representativeImage.alt}
        width={240}
        height={144}
      />
      <p>카테고리: {project.category}</p>
      <h3>프로젝트 제목: {project.name}</h3>
      <p>프로젝트 한 줄 소개: {project.summary}</p>
      {project.techStack ? <p>사용 기술: {project.techStack.join(", ")}</p> : null}
      <p>조회수: {project.stats.viewCount}</p>
      <p>좋아요 수: {project.stats.likeCount}</p>
    </article>
  );
}

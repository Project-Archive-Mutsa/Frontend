// 프로젝트가 출품되거나 제작된 대회·활동 유형
export type ProjectCategory =
  | "해커톤"
  | "캡스톤디자인"
  | "창업경진대회"
  | "아이디어 공모전"
  | "정책 공모전"
  | "졸업전시"
  | "산학협력 프로젝트"
  | "연구·논문 대회";

// 인기 프로젝트 목록에 사용하는 프로젝트 정보
export interface PopularProject {
  // a. 기본 정보
  id: string; // 프로젝트 식별자
  slug: string; // 상세 주소용 식별 문자열
  name: string; // 프로젝트 이름
  summary: string; // 프로젝트 한 줄 소개
  representativeImage: { // 대표 이미지
    src: string; // 이미지 경로
    alt: string; // 이미지 대체 텍스트
  };

  // b. 프로젝트 정보
  category: ProjectCategory; // 대회·활동 카테고리
  techStack?: readonly string[]; // 선택형 사용 기술 목록

  // c. 반응 정보
  stats: { // 프로젝트 반응 통계
    viewCount: number; // 조회수
    likeCount: number; // 좋아요 수
  };
}

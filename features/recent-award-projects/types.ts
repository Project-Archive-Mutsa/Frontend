// 최근 수상작 API가 반환하는 항목
export interface RecentAwardProjectResponseItem {
  awardId: number; // 수상작 식별자
  projectName: string; // 프로젝트 이름
  category: string; // 대회·활동 카테고리
  description: string; // 프로젝트 설명
  organization: string; // 대회 이름
  awardRank: string; // 수상 등급
  representativeImageUrl: string; // 대표 이미지 URL
  awardedDate: string; // 수상일
  viewCount: number; // 조회수
  likeCount: number; // 좋아요 수
  detailPath: string; // 상세 페이지 경로
}

// 최근 수상작 API 공통 응답
export interface RecentAwardProjectsResponse {
  success: boolean; // 요청 성공 여부
  data: readonly RecentAwardProjectResponseItem[]; // 최근 수상작 목록
  message: string | null; // 서버 응답 메시지
}

// 최근 수상작 목록 화면에서 사용하는 프로젝트 정보
export interface RecentAwardProject {
  id: number; // 수상작 식별자
  detailPath: string; // 상세 페이지 경로
  name: string; // 프로젝트 이름
  summary: string; // 프로젝트 설명
  representativeImage: { // 대표 이미지
    src: string; // 이미지 URL
    alt: string; // 이미지 대체 텍스트
  };
  category: string; // 대회·활동 카테고리
  award: { // 수상 정보
    competitionName: string; // 대회 이름
    title: string; // 수상 등급
    awardedAt: string; // 수상일
  };
  stats: { // 프로젝트 반응 통계
    viewCount: number; // 조회수
    likeCount: number; // 좋아요 수
  };
}

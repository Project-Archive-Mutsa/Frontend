// 인기 프로젝트 API가 반환하는 프로젝트 요약 정보
export interface PopularProject {
  id: number; // 프로젝트 식별자
  name: string; // 프로젝트 이름
  description: string; // 프로젝트 설명
  thumbnailUrl: string; // 대표 이미지 경로
  viewCount: number; // 조회수
  likeCount: number; // 좋아요 수
  bookmarkCount: number; // 북마크 수
  registeredDate: string; // 등록일
  teamMembers: readonly string[]; // 팀원 목록
  tags: readonly string[]; // 프로젝트 태그 목록
  price: number; // 판매 가격
  bookmarked: boolean; // 현재 사용자의 북마크 여부
  detailUrl: string; // 프로젝트 상세 경로
}

// 인기 프로젝트 목록 API의 공통 응답 형식
export interface PopularProjectsResponse {
  success: boolean; // 요청 성공 여부
  data: readonly PopularProject[]; // 인기 프로젝트 목록
  message: string | null; // 서버 응답 메시지
}

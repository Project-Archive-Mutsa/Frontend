// AI 프로젝트 검색 대상
export type ProjectDiscoveryTarget = "PROJECT" | "CONTEST" | "IDEA" | "AWARD";

// 검색 결과 이미지 정보
export interface ProjectDiscoveryImage {
  imageId: number | null; // 이미지 식별자
  imageUrl: string; // 이미지 URL
  originalFileName: string | null; // 원본 파일 이름
  displayOrder: number; // 노출 순서
  representative: boolean; // 대표 이미지 여부
}

// 프로젝트·공모전·아이디어·수상작 공통 검색 결과
export interface ProjectDiscoveryResultItem {
  type: ProjectDiscoveryTarget; // 검색 결과 종류
  id: number; // 결과 식별자
  title: string; // 결과 제목
  description: string; // 결과 설명
  category: string; // 결과 카테고리
  tags: readonly string[]; // 관련 태그 목록
  representativeImageUrl: string | null; // 대표 이미지 URL
  images: readonly ProjectDiscoveryImage[]; // 추가 이미지 목록
  detailPath: string; // 상세 페이지 경로
  similarityScore: number; // AI 유사도 점수
}

// AI 프로젝트 검색 결과 데이터
export interface ProjectDiscoveryResultsData {
  query: string; // 검색어
  matchedCategories: readonly string[]; // AI가 분류한 관련 카테고리
  targets: readonly ProjectDiscoveryTarget[]; // 검색 대상 목록
  projects: readonly ProjectDiscoveryResultItem[]; // 프로젝트 결과
  contests: readonly ProjectDiscoveryResultItem[]; // 공모전 결과
  ideas: readonly ProjectDiscoveryResultItem[]; // 아이디어 결과
  awards: readonly ProjectDiscoveryResultItem[]; // 수상작 결과
}

// AI 프로젝트 검색 API 공통 응답
export interface ProjectDiscoveryResultsResponse {
  success: boolean; // 요청 성공 여부
  data: ProjectDiscoveryResultsData | null; // 검색 결과 데이터
  message: string | null; // 서버 응답 메시지
}

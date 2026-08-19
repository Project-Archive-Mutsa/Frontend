// 인기 프로젝트 API가 반환하는 항목
export interface PopularProjectResponseItem {
  projectId: number; // 프로젝트 식별자
  projectName: string; // 프로젝트 이름
  description: string; // 프로젝트 설명
  category: string; // 프로젝트 카테고리
  registeredDate: string; // 등록일
  representativeImageUrl: string | null; // 대표 이미지 URL
  tags: readonly string[]; // 프로젝트 태그 목록
  viewCount: number; // 조회수
  likeCount: number; // 좋아요 수
  bookmarkCount: number; // 북마크 수
  sellerName: string; // 판매자 이름
  price: number; // 판매 가격
  bookmarked: boolean; // 현재 사용자의 북마크 여부
  zipFile: { // 판매 파일 정보
    originalFileName: string; // 원본 파일 이름
    fileSize: number; // 파일 크기
    downloadUrl: string; // 다운로드 URL
  } | null;
  detailPath: string; // 프로젝트 상세 경로
  informationCompletenessScore?: number | null; // 프로젝트 등록 정보 충실도 점수
  registrationPurpose?: ProjectRegistrationPurpose | null;
  eventName?: string | null;
  eventDate?: string | null;
  resultLevel?: ProjectResultLevel | null;
  activityStatus?: ProjectActivityStatus | null;
  assetCount?: number | null;
  assetCategories?: readonly string[];
  awards?: readonly { title: string; awardedAt?: string | null }[];
}

// 인기 프로젝트 목록 화면에서 사용하는 프로젝트 정보
export interface PopularProject {
  id: number; // 프로젝트 식별자
  name: string; // 프로젝트 이름
  description: string; // 프로젝트 설명
  thumbnailUrl: string | null; // 대표 이미지 경로
  category?: string;
  viewCount: number; // 조회수
  likeCount: number; // 좋아요 수
  bookmarkCount: number; // 북마크 수
  registeredDate: string; // 등록일
  sellerName: string; // 판매자 이름
  tags: readonly string[]; // 프로젝트 태그 목록
  price: number; // 판매 가격
  bookmarked: boolean; // 현재 사용자의 북마크 여부
  detailUrl: string; // 프로젝트 상세 경로
  informationCompletenessScore?: number | null; // 프로젝트 등록 정보 충실도 점수
  registrationPurpose?: ProjectRegistrationPurpose | null;
  eventName?: string | null;
  eventDate?: string | null;
  resultLevel?: ProjectResultLevel | null;
  activityStatus?: ProjectActivityStatus | null;
  assetCount?: number | null;
  assetCategories?: readonly string[];
  awardTitles?: readonly string[] | null;
}

// 인기 프로젝트 목록 API의 공통 응답 형식
export interface PopularProjectsResponse {
  success: boolean; // 요청 성공 여부
  data: readonly PopularProjectResponseItem[]; // 인기 프로젝트 목록
  message: string | null; // 서버 응답 메시지
}
import type {
  ProjectActivityStatus,
  ProjectRegistrationPurpose,
  ProjectResultLevel,
} from "@/shared/project-summary/types";

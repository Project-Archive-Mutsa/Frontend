// 좀비 프로젝트 API가 반환하는 ZIP 파일 정보
export interface ZombieProjectZipFileResponse {
  originalFileName: string;
  fileSize: number;
  downloadUrl: string;
}

// 좀비 프로젝트 API가 반환하는 항목
export interface ZombieProjectResponseItem {
  projectId: number;
  projectName: string;
  description: string;
  registeredDate: string;
  representativeImageUrl: string | null;
  tags: readonly string[];
  viewCount: number;
  likeCount: number;
  bookmarkCount: number;
  sellerName?: string;
  price: number;
  zipFile: ZombieProjectZipFileResponse | null;
  detailPath: string;
  informationCompletenessScore?: number | null;
  category?: string | null;
  registrationPurpose?: ProjectRegistrationPurposeInput | null;
  eventName?: string | null;
  eventDate?: string | null;
  resultLevel?: ProjectResultLevel | null;
  activityStatus?: ProjectActivityStatus | null;
  assetCount?: number | null;
  assetCategories?: readonly string[];
  awards?: readonly { title: string; awardedAt?: string | null }[];
  publicAssets?: readonly ZombiePublicAssetSummary[];
  bookmarked?: boolean;
}

// 좀비 프로젝트 목록 API의 공통 응답 형식
export interface ZombieProjectsResponse {
  success: boolean;
  data: readonly ZombieProjectResponseItem[];
  message: string | null;
}

// 좀비 프로젝트 목록 화면에서 사용하는 프로젝트 정보
export interface ZombieProject {
  id: number;
  detailPath: string;
  name: string;
  description: string;
  registeredAt: string;
  representativeImage: {
    src: string;
    alt: string;
  } | null;
  tags: readonly string[];
  stats: {
    viewCount: number;
    likeCount: number;
    bookmarkCount: number;
  };
  sellerName?: string;
  price: number;
  zipFile: {
    name: string;
    sizeInBytes: number;
  } | null;
  informationCompletenessScore?: number | null;
  category?: string | null;
  registrationPurpose?: ProjectRegistrationPurpose | null;
  eventName?: string | null;
  eventDate?: string | null;
  resultLevel?: ProjectResultLevel | null;
  activityStatus?: ProjectActivityStatus | null;
  assetCount?: number | null;
  assetCategories?: readonly string[];
  awardTitles?: readonly string[] | null;
  bookmarked?: boolean;
}

// 프로젝트 검색 API가 반환하는 분석 대상 파일
export interface ZombieProjectSearchFile {
  path: string;
  extension: string;
  kind: string;
  size: number;
}

// 프로젝트 검색 API가 반환하는 추가 분석 섹션
export interface ZombieProjectSearchSection {
  title: string;
  items: readonly string[];
}

// 프로젝트 검색 API가 반환하는 프로젝트 분석 정보
export interface ZombieProjectSearchResult {
  projectTitle: string;
  totalFiles: number;
  selectedFiles: readonly ZombieProjectSearchFile[];
  functionalSummary: readonly string[];
  differentiators: readonly string[];
  technicalStrengths: readonly string[];
  futureDirections: readonly string[];
  sections: readonly ZombieProjectSearchSection[];
}

// 검색 API가 분석형 또는 목록형 프로젝트를 반환할 때의 화면 모델
export type ZombieProjectSearchItem =
  | {
      kind: "analysis";
      project: ZombieProjectSearchResult;
    }
  | {
      kind: "catalog";
      project: ZombieProject;
    };

// 프로젝트 검색 API의 검색 결과 데이터
export interface ZombieProjectSearchResults {
  query: string;
  totalCount: number;
  projects: readonly ZombieProjectSearchItem[];
}
import type {
  ProjectActivityStatus,
  ProjectRegistrationPurpose,
  ProjectRegistrationPurposeInput,
  ProjectResultLevel,
} from "@/shared/project-summary/types";

export interface ZombiePublicAssetSummary {
  name: string;
  category: string;
  licenseName: string | null;
  reuseTerms: string | null;
  attribution?: string | null;
  publicSource?: string | null;
}

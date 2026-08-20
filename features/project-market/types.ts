import type {
  ProjectActivityStatus,
  ProjectPricingMode,
  ProjectRegistrationPurpose,
  ProjectRegistrationPurposeInput,
  ProjectResultLevel,
} from "@/shared/project-summary/types";

export interface ProjectMarketImageResponse {
  imageId: number | null;
  imageUrl: string;
  originalFileName: string | null;
  displayOrder: number;
  representative: boolean;
}

export interface ProjectMarketZipFileResponse {
  originalFileName: string;
  fileSize: number;
  downloadUrl: string;
}

export interface ProjectMarketProjectResponseItem {
  projectId: number;
  projectName: string;
  description: string;
  category?: string;
  registeredDate: string;
  representativeImageUrl: string | null;
  images: readonly ProjectMarketImageResponse[];
  tags: readonly string[];
  viewCount: number;
  likeCount: number;
  bookmarkCount: number;
  sellerName?: string;
  price: number;
  bookmarked: boolean;
  zipFile: ProjectMarketZipFileResponse | null;
  detailPath: string;
  informationCompletenessScore?: number | null;
  registrationPurpose?: ProjectRegistrationPurposeInput | null;
  eventName?: string | null;
  eventDate?: string | null;
  resultLevel?: ProjectResultLevel | null;
  activityStatus?: ProjectActivityStatus | null;
  assetCount?: number | null;
  assetCategories?: readonly string[];
  awards?: readonly { title: string; awardedAt?: string | null }[];
  pricingMode?: ProjectPricingMode | null;
  saleRightsSummary?: string | null;
  transferScope?: string | null;
}

export interface ProjectMarketProjectsResponse {
  success: boolean;
  data: readonly ProjectMarketProjectResponseItem[];
  message: string | null;
}

export interface ProjectMarketProject {
  id: number;
  name: string;
  description: string;
  category?: string;
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
  price: number | null;
  registrationPurpose?: ProjectRegistrationPurpose | null;
  eventName?: string | null;
  eventDate?: string | null;
  resultLevel?: ProjectResultLevel | null;
  activityStatus?: ProjectActivityStatus | null;
  assetCount?: number | null;
  assetCategories?: readonly string[];
  awardTitles?: readonly string[] | null;
  pricingMode?: ProjectPricingMode | null;
  saleRightsSummary?: string | null;
  zipFile: {
    name: string;
    sizeInBytes: number;
  } | null;
  informationCompletenessScore?: number | null;
  bookmarked: boolean;
  transferScope: string | null;
}

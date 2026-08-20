import type {
  ProjectActivityStatus,
  ProjectRegistrationPurposeInput,
  ProjectRegistrationPurpose,
  ProjectResultLevel,
} from "@/shared/project-summary/types";

export type ProjectDetailAccess = "PUBLIC_SUMMARY" | "SUBSCRIBER_REPORT";

export interface ProjectExplorerSearchState {
  query: string;
  eventType: string;
  eventYear: string;
  category: string;
  resultLevel: ProjectResultLevel | "";
  activityStatus: ProjectActivityStatus | "";
  sort: "RECENT" | "POPULAR";
  page: number;
}

export interface ProjectExplorerImageResponse {
  imageUrl: string;
  displayOrder: number;
  representative: boolean;
}

export interface ProjectExplorerResponseItem {
  projectId: number;
  projectName: string;
  description: string;
  category: string;
  registeredDate: string;
  representativeImageUrl: string | null;
  images: readonly ProjectExplorerImageResponse[];
  tags: readonly string[];
  viewCount: number;
  likeCount: number;
  bookmarkCount: number;
  sellerName: string;
  informationCompletenessScore?: number | null;
  registrationPurpose?: ProjectRegistrationPurposeInput | null;
  eventName?: string | null;
  eventDate?: string | null;
  resultLevel?: ProjectResultLevel | null;
  activityStatus?: ProjectActivityStatus | null;
  assetCount?: number | null;
  assetCategories?: readonly string[];
  awards?: readonly { title: string; awardedAt?: string | null }[];
}

export interface ArchiveProjectItem {
  kind: "archive";
  id: number;
  name: string;
  description: string;
  category: string;
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
  registrantName?: string;
  registrationPurpose: ProjectRegistrationPurpose | null;
  eventName: string | null;
  eventDate: string | null;
  resultLevel: ProjectResultLevel | null;
  activityStatus: ProjectActivityStatus | null;
  assetCount: number | null;
  assetCategories: readonly string[];
  awardTitles: readonly string[] | null;
  detailAccess: ProjectDetailAccess;
  informationCompletenessScore: number | null;
  bookmarked: boolean;
}

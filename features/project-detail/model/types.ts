import type {
  ProjectActivityStatus,
  ProjectPricingMode,
  ProjectRegistrationPurpose,
  ProjectResultLevel,
} from "@/shared/project-summary/types";

export type ProjectReportAccessStatus =
  | "LOCKED"
  | "GRANTED"
  | "OWNER"
  | "UNAVAILABLE";

export interface ProjectDetailedInfoFile {
  id: number;
  pageId: number | null;
  name: string;
  sizeInBytes: number;
  assetType: string | null;
}

export type ProjectPurposeDetail =
  | { purpose: "ZOMBIE" }
  | {
      purpose: "SELL";
      transferScope: string | null;
      priceType: ProjectPricingMode | null;
      price: number | null;
      saleStatus: string | null;
      includedAssets: { count: number; categories: readonly string[] };
      purchasable: boolean;
    }
  | {
      purpose: "TEAM_RECRUIT";
      recruitmentId: number;
      status: "OPEN" | "CLOSED";
      roles: readonly string[];
      headcount: number;
      requiredSkills: readonly string[];
      activitySchedule: string | null;
      workMode: string | null;
      deadline: string | null;
      applicationGuide: string | null;
      referenceAssetSummary: string | null;
    };

export interface ProjectDetailViewModel {
  id: number;
  name: string;
  summary: string;
  representativeImageUrl: string | null;
  galleryImageUrls: readonly string[];
  registrationPurpose: ProjectRegistrationPurpose;
  registeredAt: string | null;
  event: { name: string | null; type: string | null; hostOrganization: string | null; startedAt: string | null; endedAt: string | null; participationTrack: string | null } | null;
  categories: readonly string[];
  problemAreas: readonly string[];
  methods: readonly string[];
  tags: readonly string[];
  resultLevel: ProjectResultLevel | null;
  activityStatus: ProjectActivityStatus | null;
  developmentPeriod: { startedAt: string | null; endedAt: string | null };
  awards: readonly { title: string; awardedAt: string | null }[];
  team: { memberCount: number | null; roles: readonly string[] } | null;
  registrant: { id: number | null; name: string } | null;
  stats: { viewCount: number; likeCount: number; bookmarkCount: number };
  viewer: { bookmarked: boolean; liked: boolean; owner: boolean };
  informationCompletenessScore: number | null;
  assetSummary: { publicCount: number; paidCount: number; categories: readonly string[] };
  reportOffer: { available: boolean; price: number | null; sectionCount: number; sectionTitles: readonly string[] };
  purposeDetail: ProjectPurposeDetail;
}

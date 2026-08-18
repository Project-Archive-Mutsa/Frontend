import type {
  ProjectActivityStatus,
  ProjectPricingMode,
  ProjectRegistrationPurpose,
  ProjectResultLevel,
} from "@/shared/project-summary/types";

export type {
  ProjectActivityStatus,
  ProjectPricingMode,
  ProjectRegistrationPurpose,
  ProjectResultLevel,
} from "@/shared/project-summary/types";

export type ProjectRegistrationStep = 1 | 2 | 3 | 4 | 5 | 6;

export type EventType =
  | "COMPETITION"
  | "CONTEST"
  | "HACKATHON"
  | "CAPSTONE"
  | "COURSE"
  | "OTHER";

export type ProjectAssetCategory =
  | "PLANNING_DOCUMENT"
  | "DESIGN"
  | "CODE_TECH"
  | "DATA"
  | "RESEARCH_VALIDATION"
  | "DEMO_MEDIA"
  | "OFFLINE_OUTPUT"
  | "OTHER";

export type AssetOwnershipStatus =
  | "OWNED"
  | "TEAM_OWNED"
  | "THIRD_PARTY_INCLUDED"
  | "UNCONFIRMED";

export type AssetAccessRequirement =
  | "PUBLIC"
  | "PERMISSION_REQUIRED"
  | "PRIVATE";

export type AssetLinkProvider =
  | "FIGMA"
  | "GITHUB"
  | "GITLAB"
  | "NOTION"
  | "GOOGLE_DRIVE"
  | "YOUTUBE"
  | "VIMEO"
  | "GENERAL";

export type AssetUsage =
  | "PAID_REPORT_EVIDENCE"
  | "ZOMBIE_PUBLIC_RESOURCE"
  | "SALE_INVENTORY"
  | "RECRUITMENT_REFERENCE";

export interface ProjectAwardDraft {
  id: string;
  title: string;
  awardedAt: string;
}

export interface UploadAssetSource {
  id: string;
  kind: "UPLOAD";
  fileName: string;
  sizeInBytes: number;
  needsReattach: boolean;
}

export interface LinkAssetSource {
  id: string;
  kind: "EXTERNAL_LINK";
  url: string;
  provider: AssetLinkProvider;
  accessRequirement: AssetAccessRequirement;
}

export type AssetSource = UploadAssetSource | LinkAssetSource;

export interface ProjectAssetDraft {
  id: string;
  category: ProjectAssetCategory | "";
  title: string;
  projectRole: string;
  description: string;
  ownershipStatus: AssetOwnershipStatus | "";
  rightsDescription: string;
  versionLabel: string;
  updatedAt: string;
  sources: AssetSource[];
}

export interface ZombieAssetTermsDraft {
  licenseName: string;
  attribution: string;
  reuseTerms: string;
}

export interface ProjectRegistrationDraft {
  eventType: EventType | "";
  customEventType: string;
  eventName: string;
  organizer: string;
  eventDate: string;
  participationTrack: string;
  awards: ProjectAwardDraft[];

  projectName: string;
  summary: string;
  representativeImageName: string;
  teamName: string;
  projectStartedAt: string;
  projectEndedAt: string;
  categories: string[];
  problemAreas: string[];
  methods: string[];
  customTags: string[];

  problemDefinition: string;
  targetAudience: string;
  solution: string;
  coreApproach: string;
  differentiation: string;
  validation: string;
  resultLevel: ProjectResultLevel | "";
  activityStatus: ProjectActivityStatus | "";

  attempts: string;
  difficulties: string;
  limitations: string;
  endReason: string;
  nextSteps: string;
  assets: ProjectAssetDraft[];

  purpose: ProjectRegistrationPurpose | "";
  zombieAssetIds: string[];
  zombieAssetTerms: Record<string, ZombieAssetTermsDraft>;
  saleAssetIds: string[];
  pricingMode: ProjectPricingMode;
  desiredPoints: string;
  saleRightsScope: string;
  recruitmentReferenceAssetIds: string[];
  recruitmentTitle: string;
  recruitmentRoles: string[];
  recruitmentSkills: string;
  recruitmentHeadcount: string;
  recruitmentSchedule: string;
  recruitmentWorkMode: string;
  recruitmentDeadline: string;
  recruitmentApplicationNote: string;
}

export type ProjectRegistrationFieldErrors = Record<string, string>;

export type DraftSaveStatus = "idle" | "saving" | "saved" | "unavailable";

export interface TeamRecruitmentResponseItem {
  id: number;
  title: string;
  description: string;
  roles: readonly string[];
  headcount: number;
  deadline: string;
  detailUrl: string;
  status: "OPEN" | "CLOSED";
  ownerUserId: number;
  projectId: number;
  projectName: string;
  representativeImageUrl: string | null;
  createdAt: string;
  requiredSkills: readonly string[];
  activitySchedule: string | null;
  workMode: string | null;
  applicationGuide: string | null;
  referenceAssetSummary: string | null;
  event: {
    name: string | null;
    type: string | null;
    hostOrganization: string | null;
    startedAt: string | null;
    endedAt: string | null;
    participationTrack: string | null;
  } | null;
  categories: readonly string[];
  resultLevel: ProjectResultLevel | null;
  activityStatus: ProjectActivityStatus | null;
  assets: { count: number; categories: readonly string[] };
  awards: readonly { title: string; awardedAt?: string | null }[];
  informationCompletenessScore: number | null;
  publicReferenceAssets: readonly {
    assetId: number;
    title: string;
    assetType: string | null;
    role: string | null;
    license: string | null;
    reuseConditions: string | null;
    publicSource: string | null;
  }[];
}

export interface TeamRecruitmentsResponse {
  success: boolean;
  data: readonly TeamRecruitmentResponseItem[];
  message: string | null;
}

export interface TeamRecruitment {
  id: number;
  title: string;
  description: string;
  roles: readonly string[];
  deadline: string;
  projectId?: number | null;
  projectName?: string | null;
  projectSummary?: string | null;
  category?: string | null;
  registeredDate?: string | null;
  representativeImage?: { src: string; alt: string } | null;
  tags?: readonly string[];
  eventName?: string | null;
  eventDate?: string | null;
  resultLevel?: ProjectResultLevel | null;
  activityStatus?: ProjectActivityStatus | null;
  referenceAssetCount?: number | null;
  referenceAssetCategories?: readonly string[];
  awardTitles?: readonly string[] | null;
  informationCompletenessScore?: number | null;
  skills?: string | null;
  headcount?: number | null;
  schedule?: string | null;
  workMode?: string | null;
  status?: "OPEN" | "CLOSED";
}
import type {
  ProjectActivityStatus,
  ProjectResultLevel,
} from "@/shared/project-summary/types";

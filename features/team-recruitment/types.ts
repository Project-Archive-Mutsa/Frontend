export interface TeamRecruitmentResponseItem {
  id: number;
  title: string;
  description: string;
  roles: readonly string[];
  deadline: string;
  detailUrl: string;
  projectId?: number | null;
  projectName?: string | null;
  projectSummary?: string | null;
  category?: string | null;
  registeredDate?: string | null;
  representativeImageUrl?: string | null;
  tags?: readonly string[];
  eventName?: string | null;
  eventDate?: string | null;
  resultLevel?: ProjectResultLevel | null;
  activityStatus?: ProjectActivityStatus | null;
  referenceAssetCount?: number | null;
  referenceAssetCategories?: readonly string[];
  awards?: readonly { title: string; awardedAt?: string | null }[];
  informationCompletenessScore?: number | null;
  skills?: string | null;
  headcount?: number | null;
  schedule?: string | null;
  workMode?: string | null;
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
}
import type {
  ProjectActivityStatus,
  ProjectResultLevel,
} from "@/shared/project-summary/types";

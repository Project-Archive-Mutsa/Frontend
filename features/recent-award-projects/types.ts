import type {
  ProjectActivityStatus,
  ProjectResultLevel,
} from "@/shared/project-summary/types";

export interface RecentAwardProjectResponseItem {
  awardId: number;
  projectId: number;
  projectName: string;
  category: string;
  description: string;
  organization: string;
  awardRank: string;
  representativeImageUrl: string | null;
  images: readonly unknown[];
  representativeImageSelected: boolean;
  resultLevel: ProjectResultLevel | null;
  activityStatus: ProjectActivityStatus | null;
  assets: { count: number; categories: readonly string[] };
  informationCompletenessScore: number | null;
  awardedDate: string;
  viewCount: number;
  likeCount: number;
  detailPath: string;
}

export interface RecentAwardProjectsResponse {
  success: true;
  data: readonly RecentAwardProjectResponseItem[];
  message?: string | null;
}

export interface RecentAwardProject {
  id: number;
  projectId: number;
  detailPath: string;
  name: string;
  summary: string;
  representativeImage: {
    src: string;
    alt: string;
  } | null;
  category: string;
  award: {
    competitionName: string;
    title: string;
    awardedAt: string;
  };
  stats: {
    viewCount: number;
    likeCount: number;
  };
  informationCompletenessScore: number | null;
  resultLevel: ProjectResultLevel | null;
  activityStatus: ProjectActivityStatus | null;
  assetCount: number;
  assetCategories: readonly string[];
}

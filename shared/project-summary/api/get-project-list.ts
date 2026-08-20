import { z } from "zod";
import type {
  ProjectActivityStatus,
  ProjectRegistrationPurpose,
  ProjectResultLevel,
} from "@/shared/project-summary/types";
import { normalizeProjectRegistrationPurpose } from "@/shared/project-summary/types";
import { getApiError, readJson } from "@/shared/api/api-error";
import { getServerApiUrl } from "@/shared/api/server-api-url";

const rawProjectPurposeSchema = z.enum([
  "REGISTER",
  "ARCHIVE",
  "ZOMBIE",
  "SELL",
  "TEAM_RECRUIT",
]);

const projectListItemSchema = z.object({
  projectId: z.number().int().positive(),
  projectName: z.string(),
  publicSummary: z.string().nullable().catch(null),
  representativeImageUrl: z.string().nullable().catch(null),
  registrationPurpose: rawProjectPurposeSchema,
  event: z
    .object({
      name: z.string().nullable().catch(null),
      type: z.string().nullable().catch(null),
      hostOrganization: z.string().nullable().catch(null),
      startedAt: z.string().nullable().catch(null),
      endedAt: z.string().nullable().catch(null),
      participationTrack: z.string().nullable().catch(null),
    })
    .nullable()
    .catch(null),
  categories: z.array(z.string()).catch([]),
  problemAreas: z.array(z.string()).catch([]),
  methods: z.array(z.string()).catch([]),
  tags: z.array(z.string()).catch([]),
  resultLevel: z
    .enum(["IDEA_PLAN", "DESIGNED", "INITIAL_OUTPUT", "SUBMISSION_OUTPUT", "APPLIED"])
    .nullable()
    .catch(null),
  activityStatus: z.enum(["ACTIVE", "PAUSED", "ENDED"]).nullable().catch(null),
  assets: z
    .object({
      count: z.number().int().nonnegative().catch(0),
      categories: z.array(z.string()).catch([]),
    })
    .catch({ count: 0, categories: [] }),
  awards: z
    .array(
      z.object({
        awardId: z.number().int().nullable().optional(),
        title: z.string(),
        awardedAt: z.string().nullable().catch(null),
      }),
    )
    .catch([]),
  informationCompletenessScore: z.number().min(0).max(100).nullable().catch(null),
  registeredAt: z.string(),
  stats: z
    .object({
      viewCount: z.number().int().nonnegative().catch(0),
      likeCount: z.number().int().nonnegative().catch(0),
      bookmarkCount: z.number().int().nonnegative().catch(0),
    })
    .catch({ viewCount: 0, likeCount: 0, bookmarkCount: 0 }),
  bookmarked: z.boolean().catch(false),
  transferScope: z.string().nullable().catch(null),
  priceType: z.enum(["FIXED", "NEGOTIABLE"]).nullable().catch(null),
  price: z.number().int().nonnegative().nullable().catch(null),
  reusableAssets: z
    .array(
      z.object({
        assetId: z.number().int().positive(),
        title: z.string(),
        assetType: z.string().nullable().catch(null),
        role: z.string().nullable().catch(null),
        license: z.string().nullable().catch(null),
        attribution: z.string().nullable().catch(null),
        reuseConditions: z.string().nullable().catch(null),
        publicSource: z.string().nullable().catch(null),
      }),
    )
    .catch([]),
});

const responseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    content: z.array(projectListItemSchema),
    page: z.number().int().nonnegative(),
    size: z.number().int().positive(),
    totalElements: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  }),
});

export interface ProjectListQuery {
  q?: string;
  registrationPurpose?: ProjectRegistrationPurpose;
  resultLevel?: ProjectResultLevel;
  activityStatus?: ProjectActivityStatus;
  eventType?: string;
  eventYear?: string;
  category?: string;
  problemArea?: string;
  method?: string;
  tag?: string;
  assetCategory?: string;
  sort?: "RECENT" | "POPULAR";
  page?: number;
  size?: number;
}

export interface ProjectListItem {
  id: number;
  name: string;
  summary: string;
  representativeImageUrl: string | null;
  registrationPurpose: ProjectRegistrationPurpose;
  event: {
    name: string | null;
    type: string | null;
    hostOrganization: string | null;
    startedAt: string | null;
    endedAt: string | null;
    participationTrack: string | null;
  } | null;
  categories: readonly string[];
  problemAreas: readonly string[];
  methods: readonly string[];
  tags: readonly string[];
  resultLevel: ProjectResultLevel | null;
  activityStatus: ProjectActivityStatus | null;
  assets: { count: number; categories: readonly string[] };
  awards: readonly { title: string; awardedAt: string | null }[];
  informationCompletenessScore: number | null;
  registeredAt: string;
  stats: { viewCount: number; likeCount: number; bookmarkCount: number };
  bookmarked: boolean;
  transferScope: string | null;
  priceType: "FIXED" | "NEGOTIABLE" | null;
  price: number | null;
}

export interface ProjectListPage {
  content: readonly ProjectListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export async function getProjectList(
  query: ProjectListQuery = {},
): Promise<ProjectListPage> {
  const url = getServerApiUrl("/api/projects");

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  });

  const response = await fetch(url, { cache: "no-store" });
  const payload = await readJson(response);
  if (!response.ok) {
    throw getApiError(payload, response.status, "프로젝트 목록을 불러오지 못했습니다.");
  }

  const parsed = responseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("프로젝트 목록 응답 형식이 올바르지 않습니다.");
  }

  return {
    ...parsed.data.data,
    content: parsed.data.data.content.map((project) => ({
      id: project.projectId,
      name: project.projectName,
      summary: project.publicSummary?.trim().slice(0, 100) ?? "",
      representativeImageUrl: project.representativeImageUrl,
      registrationPurpose: normalizeProjectRegistrationPurpose(
        project.registrationPurpose,
      ),
      event: project.event,
      categories: project.categories,
      problemAreas: project.problemAreas,
      methods: project.methods,
      tags: project.tags,
      resultLevel: project.resultLevel,
      activityStatus: project.activityStatus,
      assets: project.assets,
      awards: project.awards.map(({ title, awardedAt }) => ({ title, awardedAt })),
      informationCompletenessScore: project.informationCompletenessScore,
      registeredAt: project.registeredAt,
      stats: project.stats,
      bookmarked: project.bookmarked,
      transferScope: project.transferScope,
      priceType: project.priceType,
      price: project.price,
    })),
  };
}

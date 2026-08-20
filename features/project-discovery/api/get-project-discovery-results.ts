import { z } from "zod";
import { getProjectDetail } from "@/features/project-detail/api/get-project-detail";
import type {
  ProjectDiscoveryResultItem,
  ProjectDiscoveryResultsData,
} from "@/features/project-discovery/types";
import { getApiError, readJson } from "@/shared/api/api-error";
import { getServerApiUrl } from "@/shared/api/server-api-url";

const PROJECT_DISCOVERY_RESULTS_PATH = "/api/ai/project-discovery/results";
const PROJECT_DETAIL_CONCURRENCY = 8;

const optionalTextSchema = z
  .string()
  .nullish()
  .transform((value) => value ?? "");

const nullableTextSchema = z
  .string()
  .nullish()
  .transform((value) => value ?? null);

const imageSchema = z.object({
  imageId: z
    .number()
    .nullable()
    .optional()
    .transform((value) => value ?? null),
  imageUrl: z.string(),
  originalFileName: nullableTextSchema,
  displayOrder: z
    .number()
    .int()
    .nullable()
    .optional()
    .transform((value) => value ?? 0),
  representative: z.boolean().optional().default(false),
});

const projectSchema = z.object({
  projectId: z.number().int(),
  projectName: z.string(),
  description: optionalTextSchema,
  category: optionalTextSchema,
  representativeImageUrl: nullableTextSchema,
  images: z.array(imageSchema).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  detailPath: optionalTextSchema,
  similarityScore: z.number(),
  similarReason: nullableTextSchema,
  differencePoint: nullableTextSchema,
  validationSuggestion: nullableTextSchema,
});

const contestSchema = z.object({
  contestId: z.number().int(),
  contestName: z.string(),
  description: optionalTextSchema,
  searchCategories: z.array(z.string()).optional().default([]),
  representativeImageUrl: nullableTextSchema,
  images: z.array(imageSchema).optional().default([]),
  detailPath: optionalTextSchema,
  similarityScore: z.number(),
});

const ideaSchema = z.object({
  ideaId: z.number().int(),
  ideaName: z.string(),
  description: optionalTextSchema,
  searchCategories: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  detailPath: optionalTextSchema,
  similarityScore: z.number(),
});

const awardSchema = z.object({
  awardId: z.number().int(),
  projectName: z.string(),
  description: optionalTextSchema,
  category: optionalTextSchema,
  representativeImageUrl: nullableTextSchema,
  images: z.array(imageSchema).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  detailPath: optionalTextSchema,
  similarityScore: z.number(),
  awardRank: nullableTextSchema,
  awardedDate: nullableTextSchema,
});

const analysisSummarySchema = z.object({
  summary: z.string(),
  keywords: z.array(z.string()),
  comparisonPoints: z.array(z.string()),
  validationPoints: z.array(z.string()),
  interpretationNote: z.string(),
});

const responseSchema = z.object({
  success: z.boolean(),
  message: z.string().nullable().optional(),
  data: z
    .object({
      query: z.string(),
      matchedCategories: z.array(z.string()),
      analysisSummary: analysisSummarySchema.nullable(),
      analysisStatus: z.enum(["PENDING", "SUCCEEDED", "PARTIAL", "FAILED"]),
      projects: z.array(projectSchema),
      contests: z.array(contestSchema),
      ideas: z.array(ideaSchema),
      awards: z.array(awardSchema),
    })
    .nullable()
    .optional(),
});

type RawProject = z.infer<typeof projectSchema>;
type RawContest = z.infer<typeof contestSchema>;
type RawIdea = z.infer<typeof ideaSchema>;
type RawAward = z.infer<typeof awardSchema>;

async function enrichProjects(
  rows: readonly RawProject[],
): Promise<ProjectDiscoveryResultItem[]> {
  const results: ProjectDiscoveryResultItem[] = [];

  for (let index = 0; index < rows.length; index += PROJECT_DETAIL_CONCURRENCY) {
    const chunk = rows.slice(index, index + PROJECT_DETAIL_CONCURRENCY);
    const details = await Promise.allSettled(
      chunk.map((row) => getProjectDetail(row.projectId)),
    );

    chunk.forEach((raw, chunkIndex) => {
      const detailResult = details[chunkIndex];
      const detail =
        detailResult.status === "fulfilled" ? detailResult.value : null;

      results.push({
        type: "PROJECT",
        id: raw.projectId,
        title: detail?.name ?? raw.projectName,
        description:
          detail?.summary ||
          raw.description ||
          "프로젝트 공개 소개가 등록되지 않았습니다.",
        category: detail?.categories[0] || raw.category || "미분류",
        tags: detail?.tags.length ? detail.tags : raw.tags,
        representativeImageUrl:
          detail?.representativeImageUrl ?? raw.representativeImageUrl,
        images: raw.images,
        detailPath: `/projects/${raw.projectId}`,
        similarityScore: raw.similarityScore,
        informationCompletenessScore: detail?.informationCompletenessScore,
        registrationPurpose: detail?.registrationPurpose,
        eventName: detail?.event?.name,
        eventDate: detail?.event?.startedAt,
        resultLevel: detail?.resultLevel,
        activityStatus: detail?.activityStatus,
        assetCount: detail
          ? detail.assetSummary.publicCount + detail.assetSummary.paidCount
          : undefined,
        assetCategories: detail?.assetSummary.categories,
        awards: detail?.awards,
        similarityReasons: raw.similarReason ? [raw.similarReason] : [],
        differences: raw.differencePoint ? [raw.differencePoint] : [],
        validationSuggestions: raw.validationSuggestion
          ? [raw.validationSuggestion]
          : [],
        metadataStatus: detail ? "FULL" : "PARTIAL",
      });
    });
  }

  return results;
}

function mapContest(raw: RawContest): ProjectDiscoveryResultItem {
  return {
    type: "CONTEST",
    id: raw.contestId,
    title: raw.contestName,
    description: raw.description,
    category: raw.searchCategories[0] ?? "공모전",
    tags: raw.searchCategories,
    representativeImageUrl: raw.representativeImageUrl,
    images: raw.images,
    detailPath: raw.detailPath,
    similarityScore: raw.similarityScore,
  };
}

function mapIdea(raw: RawIdea): ProjectDiscoveryResultItem {
  return {
    type: "IDEA",
    id: raw.ideaId,
    title: raw.ideaName,
    description: raw.description,
    category: raw.searchCategories[0] ?? "아이디어",
    tags: raw.tags,
    representativeImageUrl: null,
    images: [],
    detailPath: raw.detailPath,
    similarityScore: raw.similarityScore,
  };
}

function mapAward(raw: RawAward): ProjectDiscoveryResultItem {
  return {
    type: "AWARD",
    id: raw.awardId,
    title: raw.projectName,
    description: raw.description,
    category: raw.category || "미분류",
    tags: raw.tags,
    representativeImageUrl: raw.representativeImageUrl,
    images: raw.images,
    detailPath: raw.detailPath,
    similarityScore: raw.similarityScore,
    awards: raw.awardRank
      ? [{ title: raw.awardRank, awardedAt: raw.awardedDate }]
      : [],
  };
}

export async function getProjectDiscoveryResults(
  query: string,
): Promise<ProjectDiscoveryResultsData> {
  const url = getServerApiUrl(PROJECT_DISCOVERY_RESULTS_PATH);
  url.searchParams.set("query", query);

  const response = await fetch(url, { cache: "no-store" });
  const payload = await readJson(response);

  if (!response.ok) {
    throw getApiError(
      payload,
      response.status,
      "AI 검색 결과 조회에 실패했습니다.",
    );
  }

  const parsed = responseSchema.safeParse(payload);

  if (!parsed.success) {
    throw new Error("AI 검색 결과 응답 형식이 올바르지 않습니다.");
  }

  if (!parsed.data.success || !parsed.data.data) {
    throw new Error(
      parsed.data.message ?? "AI 검색 결과를 조회하지 못했습니다.",
    );
  }

  const data = parsed.data.data;
  const projects = await enrichProjects(data.projects);

  return {
    query: data.query,
    matchedCategories: data.matchedCategories,
    targets: ["PROJECT", "CONTEST", "IDEA", "AWARD"],
    analysis: data.analysisSummary,
    analysisStatus: data.analysisStatus,
    projects,
    contests: data.contests.map(mapContest),
    ideas: data.ideas.map(mapIdea),
    awards: data.awards.map(mapAward),
  };
}

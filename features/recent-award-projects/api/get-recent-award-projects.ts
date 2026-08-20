import { z } from "zod";
import type { RecentAwardProject } from "@/features/recent-award-projects/types";
import { getApiError, readJson } from "@/shared/api/api-error";
import { getServerApiUrl } from "@/shared/api/server-api-url";
import { mapRecentAwardProject } from "./map-recent-award-project";

const RECENT_AWARD_PROJECTS_PATH = "/api/awards/recent";

const recentAwardProjectSchema = z.object({
  awardId: z.number().int().positive(),
  projectId: z.number().int().positive(),
  projectName: z.string(),
  category: z.string(),
  description: z.string(),
  organization: z.string(),
  awardRank: z.string(),
  representativeImageUrl: z.string().nullable().catch(null),
  images: z.array(z.unknown()).catch([]),
  representativeImageSelected: z.boolean().catch(false),
  resultLevel: z
    .enum([
      "IDEA_PLAN",
      "DESIGNED",
      "INITIAL_OUTPUT",
      "SUBMISSION_OUTPUT",
      "APPLIED",
    ])
    .nullable()
    .catch(null),
  activityStatus: z
    .enum(["ACTIVE", "PAUSED", "ENDED"])
    .nullable()
    .catch(null),
  assets: z
    .object({
      count: z.number().int().nonnegative().catch(0),
      categories: z.array(z.string()).catch([]),
    })
    .catch({ count: 0, categories: [] }),
  informationCompletenessScore: z
    .number()
    .min(0)
    .max(100)
    .nullable()
    .catch(null),
  awardedDate: z.string(),
  viewCount: z.number().int().nonnegative(),
  likeCount: z.number().int().nonnegative(),
  detailPath: z.string(),
});

const recentAwardProjectsResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(recentAwardProjectSchema),
  message: z.string().nullable().optional(),
});

export async function getRecentAwardProjects(): Promise<
  readonly RecentAwardProject[]
> {
  const response = await fetch(
    getServerApiUrl(RECENT_AWARD_PROJECTS_PATH),
    {
      cache: "no-store",
    },
  );

  const payload = await readJson(response);

  if (!response.ok) {
    throw getApiError(
      payload,
      response.status,
      "최근 수상작 조회에 실패했습니다.",
    );
  }

  const parsed = recentAwardProjectsResponseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("최근 수상작 응답 형식이 올바르지 않습니다.");
  }

  return parsed.data.data.map(mapRecentAwardProject);
}

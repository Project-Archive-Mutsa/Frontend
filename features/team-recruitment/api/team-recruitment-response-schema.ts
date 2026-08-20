import { z } from "zod";
import type { TeamRecruitmentResponseItem } from "@/features/team-recruitment/types";

export const teamRecruitmentResponseItemSchema: z.ZodType<TeamRecruitmentResponseItem> =
  z.object({
    id: z.number().int().nonnegative(),
    title: z.string(),
    description: z.string(),
    roles: z.array(z.string()),
    headcount: z.number().int().positive(),
    deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    detailUrl: z.string().min(1),
    status: z.enum(["OPEN", "CLOSED"]),
    ownerUserId: z.number().int().positive(),
    projectId: z.number().int().positive(),
    projectName: z.string(),
    representativeImageUrl: z.string().nullable(),
    createdAt: z.string(),
    requiredSkills: z.array(z.string()).catch([]),
    activitySchedule: z.string().nullable().catch(null),
    workMode: z.string().nullable().catch(null),
    applicationGuide: z.string().nullable().catch(null),
    referenceAssetSummary: z.string().nullable().catch(null),
    event: z.object({
      name: z.string().nullable().catch(null),
      type: z.string().nullable().catch(null),
      hostOrganization: z.string().nullable().catch(null),
      startedAt: z.string().nullable().catch(null),
      endedAt: z.string().nullable().catch(null),
      participationTrack: z.string().nullable().catch(null),
    }).nullable().catch(null),
    categories: z.array(z.string()).catch([]),
    resultLevel: z
      .enum(["IDEA_PLAN", "DESIGNED", "INITIAL_OUTPUT", "SUBMISSION_OUTPUT", "APPLIED"])
      .nullable(),
    activityStatus: z.enum(["ACTIVE", "PAUSED", "ENDED"]).nullable(),
    assets: z.object({ count: z.number().int().nonnegative(), categories: z.array(z.string()) }),
    awards: z
      .array(z.object({ title: z.string(), awardedAt: z.string().nullable().optional() }))
      .catch([]),
    informationCompletenessScore: z
      .number()
      .int()
      .min(0)
      .max(100)
      .nullable(),
    publicReferenceAssets: z.array(z.object({
      assetId: z.number().int().positive(),
      title: z.string(),
      assetType: z.string().nullable().catch(null),
      role: z.string().nullable().catch(null),
      license: z.string().nullable().catch(null),
      reuseConditions: z.string().nullable().catch(null),
      publicSource: z.string().nullable().catch(null),
    })).catch([]),
  });

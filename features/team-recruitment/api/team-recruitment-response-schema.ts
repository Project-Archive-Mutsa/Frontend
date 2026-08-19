import { z } from "zod";
import type { TeamRecruitmentResponseItem } from "@/features/team-recruitment/types";

export const teamRecruitmentResponseItemSchema: z.ZodType<TeamRecruitmentResponseItem> =
  z.object({
    id: z.number().int().nonnegative(),
    title: z.string(),
    description: z.string(),
    roles: z.array(z.string()),
    deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    detailUrl: z.string().min(1),
    projectId: z.number().int().nonnegative().nullable().optional(),
    projectName: z.string().nullable().optional(),
    projectSummary: z.string().nullable().optional(),
    category: z.string().nullable().optional(),
    registeredDate: z.string().nullable().optional(),
    representativeImageUrl: z.string().nullable().optional(),
    tags: z.array(z.string()).optional(),
    eventName: z.string().nullable().optional(),
    eventDate: z.string().nullable().optional(),
    resultLevel: z
      .enum(["IDEA_PLAN", "DESIGNED", "INITIAL_OUTPUT", "SUBMISSION_OUTPUT", "APPLIED"])
      .nullable()
      .optional(),
    activityStatus: z.enum(["ACTIVE", "PAUSED", "ENDED"]).nullable().optional(),
    referenceAssetCount: z.number().int().nonnegative().nullable().optional(),
    referenceAssetCategories: z.array(z.string()).optional(),
    awards: z
      .array(z.object({ title: z.string(), awardedAt: z.string().nullable().optional() }))
      .optional(),
    informationCompletenessScore: z
      .number()
      .int()
      .min(0)
      .max(100)
      .nullable()
      .optional(),
    skills: z.string().nullable().optional(),
    headcount: z.number().int().positive().nullable().optional(),
    schedule: z.string().nullable().optional(),
    workMode: z.string().nullable().optional(),
  });

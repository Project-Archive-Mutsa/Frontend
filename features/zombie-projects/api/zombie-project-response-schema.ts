import { z } from "zod";
import type { ZombieProjectResponseItem } from "@/features/zombie-projects/types";

export const zombieProjectResponseItemSchema: z.ZodType<ZombieProjectResponseItem> =
  z.object({
    projectId: z.number().int().nonnegative(),
    projectName: z.string(),
    description: z.string(),
    registeredDate: z.string(),
    representativeImageUrl: z.string().nullable(),
    tags: z.array(z.string()),
    viewCount: z.number().int().nonnegative(),
    likeCount: z.number().int().nonnegative(),
    bookmarkCount: z.number().int().nonnegative(),
    sellerName: z.string(),
    price: z.number().nonnegative(),
    zipFile: z
      .object({
        originalFileName: z.string(),
        fileSize: z.number().int().nonnegative(),
        downloadUrl: z.string(),
      })
      .nullable(),
    detailPath: z.string(),
    informationCompletenessScore: z
      .number()
      .int()
      .min(0)
      .max(100)
      .nullable()
      .optional(),
    category: z.string().nullable().optional(),
    registrationPurpose: z
      .enum(["REGISTER", "ARCHIVE", "ZOMBIE", "SELL", "TEAM_RECRUIT"])
      .nullable()
      .optional(),
    eventName: z.string().nullable().optional(),
    eventDate: z.string().nullable().optional(),
    resultLevel: z
      .enum(["IDEA_PLAN", "DESIGNED", "INITIAL_OUTPUT", "SUBMISSION_OUTPUT", "APPLIED"])
      .nullable()
      .optional(),
    activityStatus: z.enum(["ACTIVE", "PAUSED", "ENDED"]).nullable().optional(),
    assetCount: z.number().int().nonnegative().nullable().optional(),
    assetCategories: z.array(z.string()).optional(),
    awards: z
      .array(z.object({ title: z.string(), awardedAt: z.string().nullable().optional() }))
      .optional(),
    publicAssets: z
      .array(
        z.object({
          name: z.string(),
          category: z.string(),
          licenseName: z.string().nullable(),
          reuseTerms: z.string().nullable(),
        }),
      )
      .optional(),
  });

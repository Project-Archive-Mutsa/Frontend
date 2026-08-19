import { z } from "zod";
import type { ProjectMarketProjectResponseItem } from "@/features/project-market/types";

const projectMarketImageResponseSchema = z.object({
  imageId: z.number().int().nonnegative().nullable(),
  imageUrl: z.string(),
  originalFileName: z.string().nullable(),
  displayOrder: z.number().int().nonnegative(),
  representative: z.boolean(),
});

export const projectMarketProjectResponseItemSchema: z.ZodType<ProjectMarketProjectResponseItem> =
  z.object({
    projectId: z.number().int().nonnegative(),
    projectName: z.string(),
    description: z.string(),
    category: z.string(),
    registeredDate: z.string(),
    representativeImageUrl: z.string().nullable(),
    images: z.array(projectMarketImageResponseSchema),
    tags: z.array(z.string()),
    viewCount: z.number().int().nonnegative(),
    likeCount: z.number().int().nonnegative(),
    bookmarkCount: z.number().int().nonnegative(),
    sellerName: z.string(),
    price: z.number().nonnegative(),
    bookmarked: z.boolean(),
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
    registrationPurpose: z
      .enum(["ARCHIVE", "ZOMBIE", "SELL", "TEAM_RECRUIT"])
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
    pricingMode: z.enum(["FIXED", "NEGOTIABLE"]).nullable().optional(),
    saleRightsSummary: z.string().nullable().optional(),
  });

import { z } from "zod";

const projectExplorerImageResponseSchema = z.object({
  imageUrl: z.string(),
  displayOrder: z.number().int().nonnegative(),
  representative: z.boolean(),
});

export const projectExplorerResponseItemSchema = z.object({
  projectId: z.number().int().nonnegative(),
  projectName: z.string(),
  description: z.string(),
  category: z.string(),
  registeredDate: z.string(),
  representativeImageUrl: z.string().nullable(),
  images: z.array(projectExplorerImageResponseSchema).optional().default([]),
  tags: z.array(z.string()),
  viewCount: z.number().int().nonnegative(),
  likeCount: z.number().int().nonnegative(),
  bookmarkCount: z.number().int().nonnegative(),
  sellerName: z.string(),
  informationCompletenessScore: z
    .number()
    .int()
    .min(0)
    .max(100)
    .nullable()
    .optional(),
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
});

export const projectExplorerEnvelopeSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  message: z.string().nullable().optional(),
});

export const projectExplorerSearchDataSchema = z.object({
  query: z.string(),
  totalCount: z.number().int().nonnegative(),
  projects: z.array(projectExplorerResponseItemSchema),
});

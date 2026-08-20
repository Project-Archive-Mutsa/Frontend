import { z } from "zod";

const contestImageSchema = z
  .object({
    imageUrl: z.string().min(1),
    representative: z.boolean().catch(false),
  })
  .passthrough();

export const ongoingContestResponseItemSchema = z.object({
  contestId: z.number().int().positive(),
  contestName: z.string().min(1),
  description: z.string(),
  representativeImageUrl: z.string().nullable().catch(null),
  images: z.array(contestImageSchema).catch([]),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  status: z.string().min(1),
  applyUrl: z.string().nullable().catch(null),
  detailPath: z.string().min(1),
});

export const ongoingContestsResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(ongoingContestResponseItemSchema),
  message: z.string().nullable().optional(),
});

export type OngoingContestResponseItem = z.infer<
  typeof ongoingContestResponseItemSchema
>;

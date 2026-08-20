import { z } from "zod";

export const recruitmentApplicationSchema = z
  .object({
    applicationId: z.number().int().positive(),
    recruitmentId: z.number().int().positive(),
    projectId: z.number().int().positive(),
    projectName: z.string().optional(),
    recruitmentTitle: z.string().optional(),
    role: z.string(),
    status: z.string(),
    appliedAt: z.string().optional(),
    createdAt: z.string().optional(),
  })
  .passthrough();

export type RecruitmentApplication = z.infer<
  typeof recruitmentApplicationSchema
>;

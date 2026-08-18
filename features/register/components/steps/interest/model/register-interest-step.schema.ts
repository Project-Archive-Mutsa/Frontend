import { z } from "zod";

const selectedInterestSchema = z.object({
  partId: z
    .number()
    .int()
    .positive("올바른 관심 파트를 선택해 주세요."),
  tagId: z.number().int().positive("올바른 관심 태그를 선택해 주세요."),
});

export const registerInterestStepSchema = z.object({
  selectedInterests: z
    .array(selectedInterestSchema)
    .min(1, "관심 태그를 하나 이상 선택해 주세요."),
});

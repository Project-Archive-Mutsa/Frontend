import { z } from "zod";

export const registerInterestStepSchema = z.object({
  selectedTagIds: z
    .array(z.number().int().positive("올바른 관심 태그를 선택해 주세요."))
    .min(1, "관심 태그를 하나 이상 선택해 주세요."),
});

import { z } from "zod";

export const registerProfileStepSchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해 주세요."),
  phoneNumber: z.string().trim().min(1, "전화번호를 입력해 주세요."),
  school: z.string().trim().min(1, "학교를 입력해 주세요."),
  department: z.string().trim().min(1, "학과를 입력해 주세요."),
});

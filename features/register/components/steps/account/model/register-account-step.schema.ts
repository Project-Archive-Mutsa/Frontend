import { z } from "zod";

export const registerAccountStepSchema = z
  .object({
    loginId: z.string().trim().min(1, "아이디를 입력해 주세요."),
    email: z
      .string()
      .trim()
      .min(1, "이메일을 입력해 주세요.")
      .pipe(z.email("올바른 이메일 형식을 입력해 주세요.")),
    password: z.string().min(1, "비밀번호를 입력해 주세요."),
    passwordConfirm: z
      .string()
      .min(1, "비밀번호를 다시 입력해 주세요."),
  })
  .refine((values) => values.password === values.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "비밀번호가 일치하지 않습니다.",
  });

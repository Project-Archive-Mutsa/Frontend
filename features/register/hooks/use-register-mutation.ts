"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { register } from "../api/register";
import { registerSchema } from "../model/register.schema";
import type { RegisterRequest } from "../model/types";

export default function useRegisterMutation() {
  const router = useRouter();
  const registerMutation = useMutation({
    mutationFn: async (values: RegisterRequest) => {
      const validationResult = registerSchema.safeParse(values);

      if (!validationResult.success) {
        throw new Error("회원가입 입력값을 다시 확인해 주세요.");
      }

      return register(validationResult.data);
    },
    onSuccess: () => router.push("/login"),
  });

  return {
    submitRegister: registerMutation.mutate,
    submitError: registerMutation.error,
    isSubmitting: registerMutation.isPending,
    resetSubmit: registerMutation.reset,
  };
}

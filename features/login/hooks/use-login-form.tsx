"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import useAuthSession from "@/shared/auth/hooks/use-auth-session";

import { login } from "../api/login";
import type { LoginRequest } from "../model/types";

export default function useLoginForm(returnPath = "/") {
  const router = useRouter();
  const { signIn } = useAuthSession();
  const [values, setValues] = useState<LoginRequest>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      signIn(response.data, values.rememberMe);
      router.replace(returnPath);
    },
  });

  function updateField<Field extends keyof LoginRequest>(
    field: Field,
    value: LoginRequest[Field],
  ) {
    loginMutation.reset();
    setValues((previousValues) => ({
      ...previousValues,
      [field]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loginMutation.mutate(values);
  }

  return {
    values,
    error: loginMutation.error,
    isPending: loginMutation.isPending,
    handleSubmit,
    updateField,
  };
}

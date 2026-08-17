"use client";

import { useMutation } from "@tanstack/react-query";
import { type FormEvent, useState } from "react";

import { login } from "../api/login";
import type { LoginRequest } from "../model/types";

export default function useLoginForm() {
  const [values, setValues] = useState<LoginRequest>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const loginMutation = useMutation({
    mutationFn: login,
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

"use client";

import { useState } from "react";

import type {
  RegisterRequest,
  RegisterScalarField,
  RegisterValidationErrors,
} from "../../../../model/types";
import { registerAccountStepSchema } from "../model/register-account-step.schema";

interface UseRegisterAccountStepParams {
  values: RegisterRequest;
  onValueChange: (field: RegisterScalarField, value: string) => void;
  onNext: () => void;
}

export default function useRegisterAccountStep({
  values,
  onValueChange,
  onNext,
}: UseRegisterAccountStepParams) {
  const [validationErrors, setValidationErrors] =
    useState<RegisterValidationErrors>({});

  function changeValue(field: RegisterScalarField, value: string) {
    setValidationErrors({});
    onValueChange(field, value);
  }

  function submitStep() {
    const validationResult = registerAccountStepSchema.safeParse(values);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;

      setValidationErrors({
        loginId: fieldErrors.loginId?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        passwordConfirm: fieldErrors.passwordConfirm?.[0],
      });
      return;
    }

    onNext();
  }

  return {
    validationErrors,
    changeValue,
    submitStep,
  };
}

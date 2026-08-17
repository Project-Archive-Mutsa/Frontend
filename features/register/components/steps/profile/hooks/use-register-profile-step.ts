"use client";

import { useState } from "react";

import type {
  RegisterRequest,
  RegisterScalarField,
  RegisterValidationErrors,
} from "../../../../model/types";
import { registerProfileStepSchema } from "../model/register-profile-step.schema";

interface UseRegisterProfileStepParams {
  values: RegisterRequest;
  onValueChange: (field: RegisterScalarField, value: string) => void;
  onNext: () => void;
}

export default function useRegisterProfileStep({
  values,
  onValueChange,
  onNext,
}: UseRegisterProfileStepParams) {
  const [validationErrors, setValidationErrors] =
    useState<RegisterValidationErrors>({});

  function changeValue(field: RegisterScalarField, value: string) {
    setValidationErrors({});
    onValueChange(field, value);
  }

  function submitStep() {
    const validationResult = registerProfileStepSchema.safeParse(values);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;

      setValidationErrors({
        name: fieldErrors.name?.[0],
        phoneNumber: fieldErrors.phoneNumber?.[0],
        school: fieldErrors.school?.[0],
        department: fieldErrors.department?.[0],
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

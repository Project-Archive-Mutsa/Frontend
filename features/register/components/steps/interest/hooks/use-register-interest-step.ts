"use client";

import { useState } from "react";

import type {
  RegisterInterest,
  RegisterValidationErrors,
} from "../../../../model/types";
import { registerInterestStepSchema } from "../model/register-interest-step.schema";
import useSignupParts from "./use-signup-parts";

interface UseRegisterInterestStepParams {
  selectedInterests: RegisterInterest[];
  onInterestToggle: (interest: RegisterInterest) => void;
  onComplete: () => void;
}

export default function useRegisterInterestStep({
  selectedInterests,
  onInterestToggle,
  onComplete,
}: UseRegisterInterestStepParams) {
  const { parts, partsError, isPartsPending } = useSignupParts();
  const [activePartId, setActivePartId] = useState<number | null>(null);
  const [validationErrors, setValidationErrors] =
    useState<RegisterValidationErrors>({});

  const activePart =
    parts.find((part) => part.partId === activePartId) ?? parts[0] ?? null;

  function selectPart(partId: number) {
    if (parts.some((part) => part.partId === partId)) {
      setActivePartId(partId);
    }
  }

  function toggleTag(tagId: number) {
    setValidationErrors({});

    if (activePart) {
      onInterestToggle({ partId: activePart.partId, tagId });
    }
  }

  function submitStep() {
    const validationResult = registerInterestStepSchema.safeParse({
      selectedInterests,
    });

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;

      setValidationErrors({
        selectedInterests: fieldErrors.selectedInterests?.[0],
      });
      return;
    }

    onComplete();
  }

  return {
    parts,
    activePart,
    partsError,
    isPartsPending,
    validationErrors,
    selectPart,
    toggleTag,
    submitStep,
  };
}

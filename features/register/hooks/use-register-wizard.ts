"use client";

import { useReducer } from "react";

import {
  initialRegisterWizardState,
  registerWizardReducer,
} from "../model/register-wizard";
import type { RegisterScalarField } from "../model/types";

export default function useRegisterWizard() {
  const [state, dispatch] = useReducer(
    registerWizardReducer,
    initialRegisterWizardState,
  );

  function updateField(field: RegisterScalarField, value: string) {
    dispatch({ type: "UPDATE_FIELD", field, value });
  }

  function toggleTag(tagId: number) {
    dispatch({ type: "TOGGLE_TAG", tagId });
  }

  function goToPreviousStep() {
    dispatch({ type: "PREVIOUS_STEP" });
  }

  function goToNextStep() {
    dispatch({ type: "NEXT_STEP" });
  }

  return {
    step: state.step,
    values: state.values,
    goToNextStep,
    goToPreviousStep,
    toggleTag,
    updateField,
  };
}

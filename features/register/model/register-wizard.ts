import type {
  RegisterRequest,
  RegisterScalarField,
  RegisterStep,
} from "./types";

export interface RegisterWizardState {
  step: RegisterStep;
  values: RegisterRequest;
}

export type RegisterWizardAction =
  | {
      type: "UPDATE_FIELD";
      field: RegisterScalarField;
      value: string;
    }
  | { type: "TOGGLE_TAG"; tagId: number }
  | { type: "NEXT_STEP" }
  | { type: "PREVIOUS_STEP" };

export const initialRegisterValues: RegisterRequest = {
  loginId: "",
  email: "",
  password: "",
  passwordConfirm: "",
  name: "",
  phoneNumber: "",
  school: "",
  department: "",
  selectedTagIds: [],
};

export const initialRegisterWizardState: RegisterWizardState = {
  step: 1,
  values: initialRegisterValues,
};

export function registerWizardReducer(
  state: RegisterWizardState,
  action: RegisterWizardAction,
): RegisterWizardState {
  switch (action.type) {
    case "UPDATE_FIELD": {
      return {
        ...state,
        values: {
          ...state.values,
          [action.field]: action.value,
        },
      };
    }

    case "TOGGLE_TAG": {
      const isSelected = state.values.selectedTagIds.includes(action.tagId);

      return {
        ...state,
        values: {
          ...state.values,
          selectedTagIds: isSelected
            ? state.values.selectedTagIds.filter(
                (selectedTagId) => selectedTagId !== action.tagId,
              )
            : [...state.values.selectedTagIds, action.tagId],
        },
      };
    }

    case "NEXT_STEP":
      return {
        ...state,
        step: Math.min(state.step + 1, 3) as RegisterStep,
      };

    case "PREVIOUS_STEP":
      return {
        ...state,
        step: Math.max(state.step - 1, 1) as RegisterStep,
      };
  }
}

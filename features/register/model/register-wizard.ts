import type {
  RegisterInterest,
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
  | { type: "TOGGLE_INTEREST"; interest: RegisterInterest }
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
  selectedInterests: [],
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

    case "TOGGLE_INTEREST": {
      const isSelected = state.values.selectedInterests.some(
        (selectedInterest) =>
          selectedInterest.partId === action.interest.partId &&
          selectedInterest.tagId === action.interest.tagId,
      );

      return {
        ...state,
        values: {
          ...state.values,
          selectedInterests: isSelected
            ? state.values.selectedInterests.filter(
                (selectedInterest) =>
                  selectedInterest.partId !== action.interest.partId ||
                  selectedInterest.tagId !== action.interest.tagId,
              )
            : [...state.values.selectedInterests, action.interest],
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

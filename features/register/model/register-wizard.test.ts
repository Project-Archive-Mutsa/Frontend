import { describe, expect, it } from "vitest";
import {
  initialRegisterWizardState,
  registerWizardReducer,
} from "./register-wizard";

describe("registerWizardReducer", () => {
  it("단계를 이동해도 입력값을 유지한다", () => {
    const updatedState = registerWizardReducer(initialRegisterWizardState, {
      type: "UPDATE_FIELD",
      field: "loginId",
      value: "archive-user",
    });
    const nextState = registerWizardReducer(updatedState, {
      type: "NEXT_STEP",
    });

    expect(nextState.step).toBe(2);
    expect(nextState.values.loginId).toBe("archive-user");
  });

  it("관심 태그를 선택하고 다시 선택하면 해제한다", () => {
    const selectedState = registerWizardReducer(initialRegisterWizardState, {
      type: "TOGGLE_INTEREST",
      interest: { partId: 1, tagId: 1 },
    });
    const unselectedState = registerWizardReducer(selectedState, {
      type: "TOGGLE_INTEREST",
      interest: { partId: 1, tagId: 1 },
    });

    expect(selectedState.values.selectedInterests).toEqual([
      { partId: 1, tagId: 1 },
    ]);
    expect(unselectedState.values.selectedInterests).toEqual([]);
  });
});

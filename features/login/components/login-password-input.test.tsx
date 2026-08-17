import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PasswordInput from "./login-password-input";

describe("PasswordInput", () => {
  it("비밀번호 표시 상태를 전환한다", () => {
    render(<PasswordInput value="password" onValueChange={vi.fn()} />);

    const passwordInput = screen.getByLabelText("비밀번호");
    const visibilityButton = screen.getByRole("button", {
      name: "비밀번호 보기",
    });

    expect(passwordInput.getAttribute("type")).toBe("password");

    fireEvent.click(visibilityButton);

    expect(passwordInput.getAttribute("type")).toBe("text");
    expect(
      screen.getByRole("button", { name: "비밀번호 숨기기" }),
    ).toBeTruthy();
  });
});

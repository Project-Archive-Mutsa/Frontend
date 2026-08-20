import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AuthSessionProvider from "@/shared/auth/components/auth-session-provider";
import { AUTH_SESSION_STORAGE_KEY } from "@/shared/auth/lib/auth-session-storage";
import AuthActions from "@/shared/components/site-header/auth-action/auth-actions";
import LoginSection from "./login-section";

const { loginMock, replaceMock } = vi.hoisted(() => ({
  loginMock: vi.fn(),
  replaceMock: vi.fn(),
}));

vi.mock("../api/login", () => ({
  login: loginMock,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => "/login",
}));

const loginResponse = {
  success: true,
  data: {
    userId: 1,
    loginId: "archive-user",
    email: "user@example.com",
    name: "홍길동",
  },
  message: "로그인에 성공했습니다.",
};

function TestProviders({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthSessionProvider>{children}</AuthSessionProvider>
    </QueryClientProvider>
  );
}

describe("로그인 세션 흐름", () => {
  beforeEach(() => {
    loginMock.mockReset();
    replaceMock.mockReset();
    window.sessionStorage.clear();
    window.localStorage.clear();
  });

  it("로그인 성공 후 사용자 정보를 저장하고 홈으로 이동한다", async () => {
    loginMock.mockResolvedValue(loginResponse);

    render(
      <TestProviders>
        <AuthActions />
        <LoginSection />
      </TestProviders>,
    );

    fireEvent.change(screen.getByLabelText("이메일"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("비밀번호"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: "로그인" }));

    await waitFor(() => {
      expect(loginMock.mock.calls[0]?.[0]).toEqual({
        email: "user@example.com",
        password: "password",
        rememberMe: false,
      });
      expect(replaceMock).toHaveBeenCalledWith("/");
    });

    expect(
      JSON.parse(
        window.sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY) ?? "null",
      ),
    ).toEqual(loginResponse.data);
    expect(
      await screen.findByRole("link", { name: "마이페이지" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "프로젝트 등록" }),
    ).toBeTruthy();
  });

  it("새로 마운트해도 저장된 사용자로 헤더를 복원한다", async () => {
    window.sessionStorage.setItem(
      AUTH_SESSION_STORAGE_KEY,
      JSON.stringify(loginResponse.data),
    );

    render(
      <AuthSessionProvider>
        <AuthActions />
      </AuthSessionProvider>,
    );

    expect(
      await screen.findByRole("link", { name: "마이페이지" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "프로젝트 등록" }),
    ).toBeTruthy();
  });

  it("로그인 상태 유지를 선택하면 다른 탭에서도 읽을 수 있게 저장한다", async () => {
    loginMock.mockResolvedValue(loginResponse);

    render(
      <TestProviders>
        <LoginSection />
      </TestProviders>,
    );

    fireEvent.change(screen.getByLabelText("이메일"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("비밀번호"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByLabelText("로그인 상태 유지"));
    fireEvent.click(screen.getByRole("button", { name: "로그인" }));

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith("/"));

    expect(
      JSON.parse(
        window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY) ?? "null",
      ),
    ).toEqual(loginResponse.data);
    expect(
      window.sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY),
    ).toBeNull();
  });
});

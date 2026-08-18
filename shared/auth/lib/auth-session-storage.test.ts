import { beforeEach, describe, expect, it } from "vitest";

import type { AuthUser } from "../model/types";
import {
  AUTH_SESSION_STORAGE_KEY,
  readAuthUser,
  storeAuthUser,
} from "./auth-session-storage";

const authUser: AuthUser = {
  userId: 1,
  loginId: "archive-user",
  email: "user@example.com",
  name: "홍길동",
};

describe("인증 세션 저장소", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it("로그인 사용자를 저장하고 다시 읽는다", () => {
    storeAuthUser(window.sessionStorage, authUser);

    expect(readAuthUser(window.sessionStorage)).toEqual(authUser);
  });

  it("형식이 잘못된 사용자 정보는 제거한다", () => {
    window.sessionStorage.setItem(
      AUTH_SESSION_STORAGE_KEY,
      JSON.stringify({ userId: 1 }),
    );

    expect(readAuthUser(window.sessionStorage)).toBeNull();
    expect(
      window.sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY),
    ).toBeNull();
  });
});

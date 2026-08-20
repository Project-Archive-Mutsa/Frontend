import { z } from "zod";

import type { AuthUser } from "../model/types";

export const AUTH_SESSION_STORAGE_KEY = "project-archive.auth-user.v2";

const authUserSchema = z.object({
  userId: z.number(),
  loginId: z.string(),
  email: z.string(),
  name: z.string(),
});

export function parseAuthUser(storedUser: string | null | undefined) {
  if (!storedUser) {
    return null;
  }

  try {
    const parsedUser = authUserSchema.safeParse(JSON.parse(storedUser));
    return parsedUser.success ? parsedUser.data : null;
  } catch {
    return null;
  }
}

export function readAuthUser(storage: Storage): AuthUser | null {
  try {
    const storedUser = storage.getItem(AUTH_SESSION_STORAGE_KEY);
    const parsedUser = parseAuthUser(storedUser);

    if (storedUser && !parsedUser) {
      storage.removeItem(AUTH_SESSION_STORAGE_KEY);
    }

    return parsedUser;
  } catch {
    try {
      storage.removeItem(AUTH_SESSION_STORAGE_KEY);
    } catch {
      // 브라우저 저장소 접근이 차단된 경우 메모리 상태만 사용한다.
    }

    return null;
  }
}

export function storeAuthUser(storage: Storage, user: AuthUser) {
  storage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(user));
}

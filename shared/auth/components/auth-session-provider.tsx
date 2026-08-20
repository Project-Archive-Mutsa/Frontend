"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import {
  AUTH_SESSION_STORAGE_KEY,
  parseAuthUser,
  storeAuthUser,
} from "../lib/auth-session-storage";
import type { AuthUser } from "../model/types";

const AUTH_SESSION_CHANGE_EVENT = "project-archive:auth-session-change";

function subscribeAuthSession(onStoreChange: () => void) {
  window.addEventListener(AUTH_SESSION_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(AUTH_SESSION_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getAuthSessionSnapshot() {
  try {
    return (
      window.sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY) ??
      window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY)
    );
  } catch {
    return null;
  }
}

function getServerAuthSessionSnapshot() {
  return undefined;
}

function notifyAuthSessionChange() {
  window.dispatchEvent(new Event(AUTH_SESSION_CHANGE_EVENT));
}

interface AuthSessionContextValue {
  user: AuthUser | null;
  isInitialized: boolean;
  signIn: (user: AuthUser, rememberMe?: boolean) => void;
}

export const AuthSessionContext =
  createContext<AuthSessionContextValue | null>(null);

interface AuthSessionProviderProps {
  children: ReactNode;
}

export default function AuthSessionProvider({
  children,
}: AuthSessionProviderProps) {
  const [memoryUser, setMemoryUser] = useState<AuthUser | null>(null);
  const storedUser = useSyncExternalStore(
    subscribeAuthSession,
    getAuthSessionSnapshot,
    getServerAuthSessionSnapshot,
  );
  const persistedUser = useMemo(() => parseAuthUser(storedUser), [storedUser]);
  const isInitialized = storedUser !== undefined;
  const user = persistedUser ?? memoryUser;

  useEffect(() => {
    if (storedUser && !persistedUser) {
      try {
        window.sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
        window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
        notifyAuthSessionChange();
      } catch {
        // 저장소 접근이 차단된 경우 잘못된 값은 로그인 상태로 사용하지 않는다.
      }
    }
  }, [persistedUser, storedUser]);

  const signIn = useCallback(
    (authenticatedUser: AuthUser, rememberMe = false) => {
      setMemoryUser(authenticatedUser);

      try {
        const targetStorage = rememberMe
          ? window.localStorage
          : window.sessionStorage;
        const staleStorage = rememberMe
          ? window.sessionStorage
          : window.localStorage;

        storeAuthUser(targetStorage, authenticatedUser);
        staleStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
        notifyAuthSessionChange();
      } catch {
        // 저장소를 사용할 수 없어도 현재 탭의 로그인 상태는 유지한다.
      }
    },
    [],
  );

  const value = useMemo(
    () => ({ user, isInitialized, signIn }),
    [isInitialized, signIn, user],
  );

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  );
}

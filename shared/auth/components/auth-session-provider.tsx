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

import { getAuthSessionStatus } from "../api/get-auth-session-status";
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

function clearStoredAuthUser() {
  try {
    window.sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
  } catch {
    // 저장소 접근이 차단돼도 나머지 인증 상태 정리를 계속한다.
  }

  try {
    window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
  } catch {
    // 저장소 접근이 차단돼도 현재 탭의 메모리 로그인 상태는 별도로 제거한다.
  }

  notifyAuthSessionChange();
}

interface AuthSessionContextValue {
  user: AuthUser | null;
  isInitialized: boolean;
  signIn: (user: AuthUser, rememberMe?: boolean) => void;
  signOut: () => void;
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
  const [validatedSessionKey, setValidatedSessionKey] = useState<string | null>(
    null,
  );
  const storedUser = useSyncExternalStore(
    subscribeAuthSession,
    getAuthSessionSnapshot,
    getServerAuthSessionSnapshot,
  );
  const persistedUser = useMemo(() => parseAuthUser(storedUser), [storedUser]);
  const candidateUser = persistedUser ?? memoryUser;
  const candidateSessionKey = persistedUser
    ? storedUser ?? null
    : memoryUser
      ? `memory:${JSON.stringify(memoryUser)}`
      : null;

  const signOut = useCallback(() => {
    setMemoryUser(null);
    setValidatedSessionKey(null);
    clearStoredAuthUser();
  }, []);

  useEffect(() => {
    if (storedUser && !persistedUser) {
      clearStoredAuthUser();
    }
  }, [persistedUser, storedUser]);

  useEffect(() => {
    if (!candidateUser || !candidateSessionKey) {
      return;
    }

    const controller = new AbortController();

    void getAuthSessionStatus(controller.signal)
      .then((status) => {
        if (status === "unauthenticated") {
          signOut();
          return;
        }

        setValidatedSessionKey(candidateSessionKey);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setValidatedSessionKey(candidateSessionKey);
        }
      });

    return () => controller.abort();
  }, [candidateSessionKey, candidateUser, signOut]);

  useEffect(() => {
    if (!candidateUser || validatedSessionKey !== candidateSessionKey) {
      return;
    }

    let controller: AbortController | null = null;

    const revalidateSession = () => {
      controller?.abort();
      controller = new AbortController();

      void getAuthSessionStatus(controller.signal)
        .then((status) => {
          if (status === "unauthenticated") {
            signOut();
          }
        })
        .catch(() => undefined);
    };
    const revalidateVisibleSession = () => {
      if (document.visibilityState === "visible") {
        revalidateSession();
      }
    };

    window.addEventListener("focus", revalidateSession);
    document.addEventListener("visibilitychange", revalidateVisibleSession);

    return () => {
      controller?.abort();
      window.removeEventListener("focus", revalidateSession);
      document.removeEventListener(
        "visibilitychange",
        revalidateVisibleSession,
      );
    };
  }, [candidateSessionKey, candidateUser, signOut, validatedSessionKey]);

  const signIn = useCallback(
    (authenticatedUser: AuthUser, rememberMe = false) => {
      let stored = false;

      try {
        const targetStorage = rememberMe
          ? window.localStorage
          : window.sessionStorage;
        const staleStorage = rememberMe
          ? window.sessionStorage
          : window.localStorage;

        storeAuthUser(targetStorage, authenticatedUser);
        staleStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
        stored = true;
        notifyAuthSessionChange();
      } catch {
        // 저장소를 사용할 수 없어도 현재 탭의 로그인 상태는 유지한다.
      }

      setMemoryUser(stored ? null : authenticatedUser);
      setValidatedSessionKey(null);
    },
    [],
  );

  const isInitialized =
    storedUser !== undefined &&
    (candidateSessionKey === null ||
      candidateSessionKey === validatedSessionKey);
  const user = isInitialized ? candidateUser : null;

  const value = useMemo(
    () => ({ user, isInitialized, signIn, signOut }),
    [isInitialized, signIn, signOut, user],
  );

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  );
}

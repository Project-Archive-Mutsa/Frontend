"use client";

import { useContext } from "react";

import { AuthSessionContext } from "../components/auth-session-provider";

export default function useAuthSession() {
  const authSession = useContext(AuthSessionContext);

  if (!authSession) {
    throw new Error("useAuthSession은 AuthSessionProvider 안에서 사용해야 합니다.");
  }

  return authSession;
}

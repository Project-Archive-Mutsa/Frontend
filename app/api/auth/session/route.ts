import { NextRequest, NextResponse } from "next/server";

import { getServerApiUrl } from "@/shared/api/server-api-url";
import { AUTH_SESSION_COOKIE_NAME } from "@/shared/auth/lib/auth-session-cookie";

const SESSION_VALIDATION_PATH = "/api/members/me/points";

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get(AUTH_SESSION_COOKIE_NAME);

  if (!sessionCookie) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const response = await fetch(getServerApiUrl(SESSION_VALIDATION_PATH), {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        Cookie: `${AUTH_SESSION_COOKIE_NAME}=${encodeURIComponent(sessionCookie.value)}`,
      },
    });

    if (response.ok) {
      return NextResponse.json({ authenticated: true });
    }

    if (response.status === 401) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: null }, { status: 503 });
  } catch {
    return NextResponse.json({ authenticated: null }, { status: 503 });
  }
}

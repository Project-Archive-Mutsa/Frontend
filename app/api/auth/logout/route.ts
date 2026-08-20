import { cookies } from "next/headers";

import { AUTH_SESSION_COOKIE_NAME } from "@/shared/auth/lib/auth-session-cookie";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_SESSION_COOKIE_NAME);

  return new Response(null, { status: 204 });
}

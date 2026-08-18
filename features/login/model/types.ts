import type { AuthUser } from "@/shared/auth/model/types";

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  success: boolean;
  data: AuthUser;
  message: string;
}

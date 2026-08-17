export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginUser {
  userId: number;
  email: string;
  nickname: string;
}

export interface LoginResponse {
  success: boolean;
  data: LoginUser;
  message: string;
}

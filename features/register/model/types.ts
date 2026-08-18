import type { RegisterRequest } from "./register.schema";

export type { RegisterRequest } from "./register.schema";

export type RegisterInterest = RegisterRequest["selectedInterests"][number];

// 회원가입 완료 후 반환되는 사용자 정보
export interface RegisterUser {
  userId: number; // 사용자 식별자
  email: string; // 가입한 이메일
  nickname: string; // 사용자 표시 이름
}

// 회원가입 API 응답
export interface RegisterResponse {
  success: boolean; // 요청 성공 여부
  data: RegisterUser | null; // 가입된 사용자 정보
  message: string | null; // 서버 응답 메시지
}

export type RegisterStep = 1 | 2 | 3;

export type RegisterScalarField = Exclude<
  keyof RegisterRequest,
  "selectedInterests"
>;

export type RegisterValidationErrors = Partial<
  Record<keyof RegisterRequest, string>
>;

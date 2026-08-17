// 관심 분야 조회에 사용하는 파트와 태그
export interface RegisterTag {
  tagId: number; // 태그 ID
  tagName: string; // 태그 이름
}

export interface RegisterPart {
  partId: number; // 파트 ID
  partName: string; // 파트 이름
  tags: RegisterTag[]; // 파트에 속한 태그 목록
}

export interface SignupPartsResponse {
  success: boolean;
  data: RegisterPart[];
  message: string | null;
}

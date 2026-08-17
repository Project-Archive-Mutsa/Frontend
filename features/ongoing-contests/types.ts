// 진행 중인 공모전 API가 반환하는 항목
export interface OngoingContestResponseItem {
  contestId: number; // 공모전 식별자
  contestName: string; // 공모전 이름
  description: string; // 공모전 설명
  representativeImageUrl: string; // 공모전 포스터 이미지 URL
  startDate: string; // 공모전 시작일
  endDate: string; // 공모전 종료일
  status: string; // 공모전 진행 상태
  detailPath: string; // 공모전 상세 경로
}

// 진행 중인 공모전 목록 화면에서 사용하는 공모전 정보
export interface OngoingContest {
  id: number; // 공모전 식별자
  title: string; // 공모전 이름
  description: string; // 공모전 설명
  imageUrl: string; // 공모전 포스터 이미지 경로
  startDate: string; // 공모전 시작일
  endDate: string; // 공모전 종료일
  detailUrl: string; // 공모전 상세 경로
}

// 진행 중인 공모전 목록 API의 공통 응답 형식
export interface OngoingContestsResponse {
  success: boolean; // 요청 성공 여부
  data: readonly OngoingContestResponseItem[]; // 진행 중인 공모전 목록
  message: string | null; // 서버 응답 메시지
}

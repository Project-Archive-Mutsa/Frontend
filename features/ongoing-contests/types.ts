// 진행 중인 공모전 목록 화면에서 사용하는 공모전 정보
export interface OngoingContest {
  id: number; // 공모전 식별자
  title: string; // 공모전 이름
  description: string; // 공모전 설명
  imageUrl: string | null; // 공모전 포스터 이미지 경로
  startDate: string; // 공모전 시작일
  endDate: string; // 공모전 종료일
  applyUrl: string | null; // 외부 공모전 사이트 URL
  detailUrl: string; // 공모전 상세 경로
}

const transactionTypeLabels: Record<string, string> = {
  CHARGE: "테스트 포인트 충전",
  PURCHASE: "프로젝트 구매",
  SALE: "프로젝트 판매 정산",
  REFUND: "프로젝트 구매 환불",
  REPORT_PURCHASE: "프로젝트 상세 정보 열람",
  REPORT_REVENUE: "프로젝트 상세 정보 콘텐츠 정산",
  REPORT_REFUND: "프로젝트 상세 정보 열람 환불",
  REPORT_REVENUE_REVERSAL: "프로젝트 상세 정보 콘텐츠 정산 취소",
};

export function getPointTransactionTypeLabel(type: string) {
  return transactionTypeLabels[type] ?? type;
}

export function formatPointTransactionDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

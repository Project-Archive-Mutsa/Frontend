const recruitmentDeadlineFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export function formatRecruitmentDeadline(deadline: string): string {
  const date = new Date(`${deadline}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return deadline;
  }

  return recruitmentDeadlineFormatter.format(date);
}

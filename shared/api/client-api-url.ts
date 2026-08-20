export function getClientApiUrl(path: string) {
  if (!path.startsWith("/api/")) {
    throw new Error("브라우저 API 경로는 /api/로 시작해야 합니다.");
  }

  return path;
}

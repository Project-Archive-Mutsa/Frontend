export function getServerApiUrl(path: string) {
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) {
    throw new Error("API_BASE_URL 환경변수가 필요합니다.");
  }
  return new URL(path, baseUrl);
}

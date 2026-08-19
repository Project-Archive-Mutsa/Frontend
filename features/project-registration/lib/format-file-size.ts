export function formatProjectAssetFileSize(sizeInBytes: number) {
  if (!Number.isFinite(sizeInBytes) || sizeInBytes < 0) return "크기 확인 불가";
  if (sizeInBytes < 1024) return `${sizeInBytes} B`;
  if (sizeInBytes < 1024 * 1024) return `${Math.round(sizeInBytes / 1024)} KB`;
  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
}

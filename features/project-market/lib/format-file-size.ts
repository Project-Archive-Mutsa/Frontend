const fileSizeFormatter = new Intl.NumberFormat("ko-KR", {
  maximumFractionDigits: 1,
});

export function formatFileSize(sizeInBytes: number): string {
  if (sizeInBytes < 1024) {
    return `${fileSizeFormatter.format(sizeInBytes)} B`;
  }

  const units = ["KB", "MB", "GB", "TB"];
  let value = sizeInBytes / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${fileSizeFormatter.format(value)} ${units[unitIndex]}`;
}

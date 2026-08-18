const BYTES_PER_KILOBYTE = 1024;
const BYTES_PER_MEGABYTE = BYTES_PER_KILOBYTE * 1024;

const sizeFormatter = new Intl.NumberFormat("ko-KR", {
  maximumFractionDigits: 1,
});

export function formatFileSize(sizeInBytes: number): string {
  if (sizeInBytes < BYTES_PER_KILOBYTE) {
    return `${sizeFormatter.format(sizeInBytes)} B`;
  }

  if (sizeInBytes < BYTES_PER_MEGABYTE) {
    return `${sizeFormatter.format(sizeInBytes / BYTES_PER_KILOBYTE)} KB`;
  }

  return `${sizeFormatter.format(sizeInBytes / BYTES_PER_MEGABYTE)} MB`;
}

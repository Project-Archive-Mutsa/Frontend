import { describe, expect, it } from "vitest";
import { formatFileSize } from "./format-file-size";

describe("formatFileSize", () => {
  it.each([
    [0, "0 B"],
    [512, "512 B"],
    [1024, "1 KB"],
    [1536, "1.5 KB"],
    [1048576, "1 MB"],
    [1572864, "1.5 MB"],
  ])("%i바이트를 %s로 표시한다", (sizeInBytes, expected) => {
    expect(formatFileSize(sizeInBytes)).toBe(expected);
  });
});

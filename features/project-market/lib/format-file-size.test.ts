import { describe, expect, it } from "vitest";
import { formatFileSize } from "./format-file-size";

describe("formatFileSize", () => {
  it.each([
    [0, "0 B"],
    [1023, "1,023 B"],
    [1536, "1.5 KB"],
    [1048576, "1 MB"],
    [1610612736, "1.5 GB"],
  ])("%i바이트를 %s로 표시한다", (sizeInBytes, expected) => {
    expect(formatFileSize(sizeInBytes)).toBe(expected);
  });
});

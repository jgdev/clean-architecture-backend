import { parseNumberOrDefault } from "@/core/utils/validation";

describe("Core Utils", () => {
  test("should parse a valid number", () => {
    const n = "10";
    expect(parseNumberOrDefault(n, 0)).toBe(10);
    expect(parseNumberOrDefault(null, 100)).toBe(100);
    expect(parseNumberOrDefault(undefined, 100)).toBe(100);
    expect(parseNumberOrDefault({}, 100)).toBe(100);
    expect(parseNumberOrDefault([], 100)).toBe(100);
  });
});

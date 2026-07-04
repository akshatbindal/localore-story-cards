import { describe, expect, it } from "vitest";
import { getProgressLabel } from "./story";

describe("story helpers", () => {
  it("formats accessible progress labels", () => {
    expect(getProgressLabel(0, 4)).toBe("Card 1 of 4");
    expect(getProgressLabel(12, 4)).toBe("Card 4 of 4");
  });
});

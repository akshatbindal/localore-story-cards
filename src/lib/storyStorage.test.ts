import { beforeEach, describe, expect, it } from "vitest";
import { starterStory } from "../data/starterStory";
import { readStoredStory, saveStory } from "./storyStorage";

describe("story storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("falls back to the starter story when storage is empty or invalid", () => {
    expect(readStoredStory().title).toBe(starterStory.title);
    localStorage.setItem("localore:last-story", "{bad json");
    expect(readStoredStory().destination).toBe(starterStory.destination);
  });

  it("persists the last generated story", () => {
    saveStory({ ...starterStory, title: "Stored Journey" });
    expect(readStoredStory().title).toBe("Stored Journey");
  });
});

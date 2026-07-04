import { describe, expect, it } from "vitest";
import { storyRequestSchema, storyResponseSchema } from "./schemas";
import { buildDemoStory } from "./demo";

describe("story request validation", () => {
  it("accepts a valid destination request with defaults", () => {
    const parsed = storyRequestSchema.parse({
      destination: "Kyoto",
      interests: ["temples", "food"]
    });

    expect(parsed.locale).toBe("en-US");
    expect(parsed.pace).toBe("balanced");
    expect(parsed.destination).toBe("Kyoto");
  });

  it("rejects invalid coordinates", () => {
    expect(() =>
      storyRequestSchema.parse({
        coordinates: { latitude: 200, longitude: 77 },
        interests: ["food"]
      })
    ).toThrow();
  });
});

describe("demo story", () => {
  it("matches the production response contract", () => {
    const story = buildDemoStory();

    expect(() => storyResponseSchema.parse(story)).not.toThrow();
    expect(story.cards).toHaveLength(4);
    expect(story.generatedWith.mode).toBe("demo");
  });
});

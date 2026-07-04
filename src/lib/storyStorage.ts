import { starterStory } from "../data/starterStory";
import type { StoryResponse } from "../types";

const storyStorageKey = "localore:last-story";

export function readStoredStory(): StoryResponse {
  try {
    const stored = localStorage.getItem(storyStorageKey);
    return stored ? ({ ...starterStory, ...JSON.parse(stored) } as StoryResponse) : starterStory;
  } catch {
    return starterStory;
  }
}

export function saveStory(story: StoryResponse) {
  localStorage.setItem(storyStorageKey, JSON.stringify(story));
}

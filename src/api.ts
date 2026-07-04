import type { StoryRequest, StoryResponse } from "./types";

const STORY_REQUEST_TIMEOUT_MS = 90_000;

export async function requestStory(payload: StoryRequest): Promise<StoryResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), STORY_REQUEST_TIMEOUT_MS);

  const response = await fetch("/api/story", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    signal: controller.signal
  })
    .catch((error) => {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("Story generation timed out. Try again with image cards off for a faster run.");
      }
      throw error;
    })
    .finally(() => clearTimeout(timeout));

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Unable to generate the story right now.");
  }

  return data as StoryResponse;
}

import type { StoryRequest, StoryResponse } from "./types";

export async function requestStory(payload: StoryRequest): Promise<StoryResponse> {
  const response = await fetch("/api/story", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Unable to generate the story right now.");
  }

  return data as StoryResponse;
}

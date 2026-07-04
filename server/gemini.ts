import { geminiStoryJsonSchema, storyResponseSchema, type StoryRequest, type StoryResponse } from "./schemas";

const INTERACTIONS_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions";
const GEMINI_TIMEOUT_MS = 45_000;
const IMAGE_CONCURRENCY = 2;
const DEFAULT_IMAGE_MODELS = ["gemini-3.1-flash-lite-image", "gemini-3.1-flash-image"];

type GeminiInteraction = {
  output_text?: string;
  output_image?: {
    data?: string;
    mime_type?: string;
  };
  steps?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
      data?: string;
      mime_type?: string;
    }>;
  }>;
};

type GeminiRequest = {
  model: string;
  input: string | Array<Record<string, unknown>>;
  store?: boolean;
  response_format?: Record<string, unknown> | Array<Record<string, unknown>>;
};

function requireKey() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return apiKey;
}

async function createInteraction(body: GeminiRequest): Promise<GeminiInteraction> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

  const response = await fetch(INTERACTIONS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": requireKey(),
      "Api-Revision": "2026-05-20"
    },
    body: JSON.stringify(body),
    signal: controller.signal
  }).finally(() => clearTimeout(timeout));

  const payload = (await response.json().catch(() => ({}))) as GeminiInteraction & { error?: { message?: string } };
  if (!response.ok) {
    throw new Error(payload.error?.message || `Gemini request failed with ${response.status}`);
  }
  return payload;
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  mapper: (item: T, index: number) => Promise<R>
) {
  const results = new Array<R>(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function extractText(interaction: GeminiInteraction) {
  if (interaction.output_text) {
    return interaction.output_text;
  }

  return (
    interaction.steps
      ?.flatMap((step) => step.content || [])
      .filter((content) => content.type === "text")
      .map((content) => content.text || "")
      .join("\n")
      .trim() || ""
  );
}

function extractImageDataUrl(interaction: GeminiInteraction) {
  const image =
    interaction.output_image ||
    interaction.steps
      ?.flatMap((step) => step.content || [])
      .find((content) => content.type === "image" && content.data);

  if (!image?.data) {
    return undefined;
  }

  return `data:${image.mime_type || "image/png"};base64,${image.data}`;
}

function getImageModels() {
  const configured = process.env.GEMINI_IMAGE_MODEL || DEFAULT_IMAGE_MODELS[0];
  return Array.from(new Set([configured, ...DEFAULT_IMAGE_MODELS]));
}

function buildStoryPrompt(request: StoryRequest) {
  const locationSignal = request.coordinates
    ? `The user location coordinates are latitude ${request.coordinates.latitude}, longitude ${request.coordinates.longitude}, accuracy ${
        request.coordinates.accuracy || "unknown"
      } meters.`
    : "No browser coordinates were provided.";

  const destinationSignal = request.destination
    ? `The user requested this destination: ${request.destination}.`
    : "Infer a nearby culturally meaningful destination from the coordinates, locale, and timezone.";

  return `
You are Localore, a culturally careful travel storyteller.

Create a destination discovery story that helps a traveler engage with local culture in meaningful ways.
Return only JSON matching the schema.

Traveler context:
- ${destinationSignal}
- ${locationSignal}
- Browser locale: ${request.locale}
- Timezone: ${request.timezone}
- Traveler profile: ${request.travelerProfile}
- Preferred pace: ${request.pace}
- Interests: ${request.interests.join(", ")}

Requirements:
- Recommend recognizable attractions and specific hidden gems.
- Include heritage context without stereotypes or invented sacred claims.
- Include local event ideas that are plausible for the place, phrased as categories if exact dates are unknown.
- Teach useful local phrases with transliteration, meaning, and when to use each phrase.
- Create 4 to 6 story cards that unfold as a day or short journey.
- Each imagePrompt must be safe for image generation, visually rich, place-specific, and avoid readable text.
- If coordinates are not enough to infer a place, use the typed destination.
`;
}

function normalizeStory(story: Omit<StoryResponse, "generatedWith">): Omit<StoryResponse, "generatedWith"> {
  return {
    ...story,
    cards: story.cards.map((card, index) => {
      const place = card.place?.trim() || story.destination;
      const title = card.title?.trim() || `${place} Story`;

      return {
        ...card,
        id: card.id?.trim() || `card-${index + 1}`,
        title,
        place,
        timeOfDay: card.timeOfDay?.trim() || `Stop ${index + 1}`,
        narrative:
          card.narrative?.trim() ||
          `Explore ${place} through a short cultural stop shaped around local stories, food, language, and everyday life.`,
        culturalInsight:
          card.culturalInsight?.trim() ||
          `This stop highlights how local heritage is carried through public spaces, craft, memory, and daily rituals.`,
        hiddenGem: card.hiddenGem?.trim() || `Ask a local guide or shopkeeper for a quieter nearby lane or viewpoint around ${place}.`,
        localPhrase: {
          local: card.localPhrase?.local?.trim() || "Hello",
          transliteration: card.localPhrase?.transliteration?.trim() || "hello",
          meaning: card.localPhrase?.meaning?.trim() || "A friendly greeting",
          usage: card.localPhrase?.usage?.trim() || "Use it when greeting someone respectfully."
        },
        imageAlt: card.imageAlt?.trim() || `${place} cultural travel scene`,
        imagePrompt:
          card.imagePrompt?.trim() ||
          `Create a respectful cinematic travel image of ${place} for a cultural destination story, no readable text.`
      };
    })
  };
}

export async function generateStory(request: StoryRequest): Promise<StoryResponse> {
  const textModel = process.env.GEMINI_TEXT_MODEL || "gemini-3.1-flash-lite";
  const imageModels = getImageModels();

  const interaction = await createInteraction({
    model: textModel,
    store: false,
    input: buildStoryPrompt(request),
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: geminiStoryJsonSchema
    }
  });

  const text = extractText(interaction);
  const parsed = storyResponseSchema
    .omit({ generatedWith: true })
    .parse(normalizeStory(JSON.parse(text) as Omit<StoryResponse, "generatedWith">)) as Omit<
    StoryResponse,
    "generatedWith"
  >;

  let imageCount = 0;
  const cards = await mapWithConcurrency(
    parsed.cards,
    IMAGE_CONCURRENCY,
    async (card) => {
      if (!request.includeImages) {
        return card;
      }

      for (const model of imageModels) {
        try {
          const imageInteraction = await createInteraction({
            model,
            store: false,
            input: `${card.imagePrompt}. Create a polished 16:9 cinematic travel story image with authentic local atmosphere, rich light, human-scale details, no logos, no readable text, no captions.`,
            response_format: {
              type: "image",
              mime_type: "image/png",
              aspect_ratio: "16:9",
              image_size: "1K"
            }
          });
          const imageUrl = extractImageDataUrl(imageInteraction);
          if (imageUrl) {
            imageCount += 1;
            return { ...card, imageUrl };
          }
        } catch (error) {
          console.warn(`Image generation failed for ${card.id} with ${model}:`, error);
        }
      }

      return card;
    }
  );

  return storyResponseSchema.parse({
    ...parsed,
    cards,
    generatedWith: {
      textModel,
      imageModel: request.includeImages ? imageModels[0] : undefined,
      imageCount,
      mode: "gemini"
    }
  });
}

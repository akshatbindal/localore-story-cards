import { z } from "zod";

export const storyRequestSchema = z.object({
  destination: z.string().trim().min(2).max(90).optional(),
  coordinates: z
    .object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
      accuracy: z.number().positive().optional()
    })
    .optional(),
  locale: z.string().trim().min(2).max(20).default("en-US"),
  timezone: z.string().trim().min(2).max(60).default("UTC"),
  travelerProfile: z.enum(["first-time", "family", "solo", "food", "history", "weekend"]).default("first-time"),
  pace: z.enum(["gentle", "balanced", "packed"]).default("balanced"),
  interests: z.array(z.string().trim().min(2).max(32)).min(1).max(6).default(["heritage", "food", "hidden gems"]),
  includeImages: z.boolean().default(true)
});

export const phraseSchema = z.object({
  local: z.string().min(1),
  transliteration: z.string().min(1),
  meaning: z.string().min(1),
  usage: z.string().min(1)
});

export const storyCardSchema = z.object({
  id: z.string().min(2),
  title: z.string().min(2),
  place: z.string().min(2),
  timeOfDay: z.string().min(2),
  narrative: z.string().min(20),
  culturalInsight: z.string().min(10),
  hiddenGem: z.string().min(8),
  localPhrase: phraseSchema,
  imagePrompt: z.string().min(20),
  imageAlt: z.string().min(8),
  imageUrl: z.string().optional()
});

export const storyResponseSchema = z.object({
  title: z.string().min(2),
  destination: z.string().min(2),
  subtitle: z.string().min(8),
  localLanguage: z.string().min(2),
  region: z.string().min(2),
  bestTime: z.string().min(2),
  safetyTip: z.string().min(8),
  etiquette: z.array(z.string().min(5)).min(3).max(6),
  cards: z.array(storyCardSchema).min(4).max(6),
  phrasebook: z.array(phraseSchema).min(4).max(8),
  hiddenGems: z.array(z.string().min(8)).min(3).max(6),
  localEvents: z.array(z.string().min(8)).min(3).max(6),
  generatedWith: z.object({
    textModel: z.string(),
    imageModel: z.string().optional(),
    imageCount: z.number().int().min(0),
    mode: z.enum(["gemini", "demo"])
  })
});

export type StoryRequest = z.infer<typeof storyRequestSchema>;
export type StoryResponse = z.infer<typeof storyResponseSchema>;
export type StoryCard = z.infer<typeof storyCardSchema>;

export const geminiStoryJsonSchema = {
  type: "object",
  properties: {
    title: { type: "string", description: "Short poetic title for the generated travel story." },
    destination: { type: "string", description: "Resolved destination name." },
    subtitle: { type: "string", description: "One sentence that previews the cultural journey." },
    localLanguage: { type: "string", description: "Primary local language or useful local language for visitors." },
    region: { type: "string", description: "State, province, country, or broad cultural region." },
    bestTime: { type: "string", description: "Best time of day or season for this micro-itinerary." },
    safetyTip: { type: "string", description: "Practical and respectful traveler safety guidance." },
    etiquette: {
      type: "array",
      minItems: 3,
      maxItems: 6,
      items: { type: "string" }
    },
    cards: {
      type: "array",
      minItems: 4,
      maxItems: 6,
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          place: { type: "string" },
          timeOfDay: { type: "string" },
          narrative: { type: "string" },
          culturalInsight: { type: "string" },
          hiddenGem: { type: "string" },
          localPhrase: {
            type: "object",
            properties: {
              local: { type: "string" },
              transliteration: { type: "string" },
              meaning: { type: "string" },
              usage: { type: "string" }
            },
            required: ["local", "transliteration", "meaning", "usage"],
            additionalProperties: false
          },
          imagePrompt: { type: "string" },
          imageAlt: { type: "string" }
        },
        required: [
          "id",
          "title",
          "place",
          "timeOfDay",
          "narrative",
          "culturalInsight",
          "hiddenGem",
          "localPhrase",
          "imagePrompt",
          "imageAlt"
        ],
        additionalProperties: false
      }
    },
    phrasebook: {
      type: "array",
      minItems: 4,
      maxItems: 8,
      items: {
        type: "object",
        properties: {
          local: { type: "string" },
          transliteration: { type: "string" },
          meaning: { type: "string" },
          usage: { type: "string" }
        },
        required: ["local", "transliteration", "meaning", "usage"],
        additionalProperties: false
      }
    },
    hiddenGems: {
      type: "array",
      minItems: 3,
      maxItems: 6,
      items: { type: "string" }
    },
    localEvents: {
      type: "array",
      minItems: 3,
      maxItems: 6,
      items: { type: "string" }
    }
  },
  required: [
    "title",
    "destination",
    "subtitle",
    "localLanguage",
    "region",
    "bestTime",
    "safetyTip",
    "etiquette",
    "cards",
    "phrasebook",
    "hiddenGems",
    "localEvents"
  ],
  additionalProperties: false
} as const;

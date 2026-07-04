export type Coordinates = {
  latitude: number;
  longitude: number;
  accuracy?: number;
};

export type Phrase = {
  local: string;
  transliteration: string;
  meaning: string;
  usage: string;
};

export type StoryCard = {
  id: string;
  title: string;
  place: string;
  timeOfDay: string;
  narrative: string;
  culturalInsight: string;
  hiddenGem: string;
  localPhrase: Phrase;
  imagePrompt: string;
  imageAlt: string;
  imageUrl?: string;
};

export type StoryResponse = {
  title: string;
  destination: string;
  subtitle: string;
  localLanguage: string;
  region: string;
  bestTime: string;
  safetyTip: string;
  etiquette: string[];
  cards: StoryCard[];
  phrasebook: Phrase[];
  hiddenGems: string[];
  localEvents: string[];
  generatedWith: {
    textModel: string;
    imageModel?: string;
    imageCount: number;
    mode: "gemini" | "demo";
  };
};

export type StoryRequest = {
  destination?: string;
  coordinates?: Coordinates;
  locale: string;
  timezone: string;
  travelerProfile: "first-time" | "family" | "solo" | "food" | "history" | "weekend";
  pace: "gentle" | "balanced" | "packed";
  interests: string[];
  includeImages: boolean;
};

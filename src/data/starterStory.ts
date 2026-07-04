import type { StoryResponse } from "../types";

export const starterStory: StoryResponse = {
  title: "A Day in Painted Light",
  destination: "Jaipur, India",
  subtitle: "A gentle cultural trail through markets, courtyards, food stalls, and old stone stories.",
  localLanguage: "Hindi",
  region: "Rajasthan, India",
  bestTime: "Early morning through golden hour",
  safetyTip: "Use registered transport after dark, carry water, and ask before photographing people or private shrines.",
  etiquette: [
    "Greet shopkeepers before bargaining.",
    "Remove footwear near temples and sacred thresholds.",
    "Use your right hand when offering or receiving food.",
    "Dress modestly around heritage and devotional spaces."
  ],
  cards: [
    {
      id: "gate",
      title: "The City Wakes in Rose",
      place: "Patrika Gate",
      timeOfDay: "Sunrise",
      narrative:
        "Begin where painted arches catch the first warm light. Every color feels decorative at first, then becomes a map of craft, season, and ceremony.",
      culturalInsight: "Rajasthani gateways often compress regional identity into color, geometry, and floral forms.",
      hiddenGem: "Walk the quieter outer path before tour groups arrive.",
      localPhrase: { local: "Namaste", transliteration: "na-ma-stay", meaning: "Hello", usage: "Use it as a respectful greeting." },
      imagePrompt: "",
      imageAlt: "Painted Jaipur gateway glowing at sunrise"
    },
    {
      id: "bazaar",
      title: "Threads That Remember Hands",
      place: "Bapu Bazaar",
      timeOfDay: "Late morning",
      narrative:
        "Textiles hang like flags of patient work. Ask about a motif and the market slows down into names of tools, families, and neighborhoods.",
      culturalInsight: "Block printing and lac work are living craft economies.",
      hiddenGem: "Ask for the story behind one motif before discussing price.",
      localPhrase: {
        local: "Kitne ka hai?",
        transliteration: "kit-nay kaa hai",
        meaning: "How much is it?",
        usage: "Use it in markets and small shops."
      },
      imagePrompt: "",
      imageAlt: "Colorful Jaipur market with textiles and bangles"
    },
    {
      id: "kund",
      title: "Cool Stone, Quiet Echoes",
      place: "Panna Meena ka Kund",
      timeOfDay: "Afternoon",
      narrative:
        "The stepwell turns water-saving engineering into a rhythm of shadow and stone, a climate lesson that happens to be beautiful.",
      culturalInsight: "Stepwells were practical reservoirs and gathering places.",
      hiddenGem: "Look for the angle where stairs form repeating diamonds.",
      localPhrase: { local: "Dhanyavaad", transliteration: "dhun-ya-vaad", meaning: "Thank you", usage: "Use after help or directions." },
      imagePrompt: "",
      imageAlt: "Historic stepwell with geometric stone stairs"
    },
    {
      id: "chai",
      title: "Evening Poured in Clay",
      place: "Old city tea stall",
      timeOfDay: "Dusk",
      narrative: "Cardamom steam rises from clay cups. The smallest pause becomes the most local part of the day.",
      culturalInsight: "Tea stalls often act as neighborhood meeting points.",
      hiddenGem: "Ask what snack is freshest instead of ordering from habit.",
      localPhrase: { local: "Bahut accha", transliteration: "ba-hut ach-cha", meaning: "Very good", usage: "Compliment food or craft." },
      imagePrompt: "",
      imageAlt: "Evening tea stall with clay cups and warm light"
    }
  ],
  phrasebook: [
    { local: "Namaste", transliteration: "na-ma-stay", meaning: "Hello", usage: "Respectful greeting." },
    { local: "Dhanyavaad", transliteration: "dhun-ya-vaad", meaning: "Thank you", usage: "After help or service." },
    { local: "Kitne ka hai?", transliteration: "kit-nay kaa hai", meaning: "How much is it?", usage: "Market pricing." },
    { local: "Bahut accha", transliteration: "ba-hut ach-cha", meaning: "Very good", usage: "Compliment food or craft." }
  ],
  hiddenGems: ["Quiet old city side lanes", "Small lac bangle workshops", "Nahargarh viewpoints before sunset traffic"],
  localEvents: ["Courtyard folk music", "Seasonal craft demonstrations", "Temple aarti from public areas"],
  generatedWith: { textModel: "demo", imageCount: 0, mode: "demo" }
};

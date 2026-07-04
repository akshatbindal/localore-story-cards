import type { StoryResponse } from "./schemas";

export function buildDemoStory(): StoryResponse {
  const destination = "Jaipur, India";

  return {
    title: "A Day in Painted Light",
    destination,
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
        id: "pink-gate",
        title: "The City Wakes in Rose",
        place: "Patrika Gate",
        timeOfDay: "Sunrise",
        narrative:
          "Begin where painted arches catch the first warm light. The city feels theatrical here, but every motif points back to a district, craft, or festival memory.",
        culturalInsight:
          "Rajasthani gateways often compress regional identity into color, geometry, and repeated floral forms.",
        hiddenGem: "Walk the quieter outer path before tour groups arrive; the side panels are often easier to study.",
        localPhrase: {
          local: "Namaste",
          transliteration: "na-ma-stay",
          meaning: "Hello",
          usage: "Use it when greeting a host, guide, or shopkeeper."
        },
        imagePrompt:
          "Cinematic travel illustration of Jaipur's Patrika Gate at sunrise, rose and saffron colors, intricate painted arches, respectful documentary feel, no readable text.",
        imageAlt: "Painted Jaipur gateway glowing at sunrise"
      },
      {
        id: "bazaar-thread",
        title: "Threads That Remember Hands",
        place: "Bapu Bazaar",
        timeOfDay: "Late morning",
        narrative:
          "In the market, textiles are not souvenirs first; they are evidence of patient hands, family workshops, and a city that still wears its craft in public.",
        culturalInsight:
          "Block printing and lac work are living craft economies, not museum leftovers.",
        hiddenGem: "Ask for the story behind one motif before discussing price; it changes the conversation.",
        localPhrase: {
          local: "Kitne ka hai?",
          transliteration: "kit-nay kaa hai",
          meaning: "How much is it?",
          usage: "A friendly way to ask the price in a market."
        },
        imagePrompt:
          "Warm documentary-style image of a Jaipur textile bazaar with block printed fabrics, lac bangles, craft details, shallow depth of field, no readable text.",
        imageAlt: "Colorful Jaipur market with textiles and bangles"
      },
      {
        id: "stepwell-cool",
        title: "Cool Stone, Quiet Echoes",
        place: "Panna Meena ka Kund",
        timeOfDay: "Afternoon",
        narrative:
          "When the day grows bright, descend visually into old geometry. The stepwell turns water-saving engineering into a rhythm of shadow and stone.",
        culturalInsight:
          "Stepwells were social infrastructure: practical reservoirs and gathering places shaped by climate.",
        hiddenGem: "Look for the angle where the stairs form repeating diamonds across the waterline.",
        localPhrase: {
          local: "Dhanyavaad",
          transliteration: "dhun-ya-vaad",
          meaning: "Thank you",
          usage: "Use after someone gives directions or shares local advice."
        },
        imagePrompt:
          "Architectural travel image of a historic Jaipur stepwell, geometric sandstone stairs, afternoon shadows, calm reflective water, no people in focus.",
        imageAlt: "Historic stepwell with geometric stone stairs"
      },
      {
        id: "chai-courtyard",
        title: "Evening Poured in Clay",
        place: "Old city tea stall",
        timeOfDay: "Dusk",
        narrative:
          "End with cardamom steam and the soft clink of clay cups. The smallest pause can become the most local part of the day.",
        culturalInsight:
          "Tea stalls often act as neighborhood newsrooms, meeting points, and informal guides to what is happening nearby.",
        hiddenGem: "Ask what snack is freshest instead of ordering from habit.",
        localPhrase: {
          local: "Bahut accha",
          transliteration: "ba-hut ach-cha",
          meaning: "Very good",
          usage: "A warm compliment for food, tea, music, or service."
        },
        imagePrompt:
          "Cinematic dusk scene at a small Jaipur chai stall, clay cups, cardamom tea steam, warm street lights, authentic and respectful, no readable text.",
        imageAlt: "Evening tea stall with clay cups and warm light"
      }
    ],
    phrasebook: [
      { local: "Namaste", transliteration: "na-ma-stay", meaning: "Hello", usage: "Greet people respectfully." },
      { local: "Dhanyavaad", transliteration: "dhun-ya-vaad", meaning: "Thank you", usage: "After help, service, or directions." },
      { local: "Kitne ka hai?", transliteration: "kit-nay kaa hai", meaning: "How much is it?", usage: "In markets and small shops." },
      { local: "Bahut accha", transliteration: "ba-hut ach-cha", meaning: "Very good", usage: "Compliment food or craft." }
    ],
    hiddenGems: [
      "Early morning side lanes near the old city gates",
      "Small lac bangle workshops away from the main market edge",
      "Quiet viewpoints around Nahargarh before sunset traffic"
    ],
    localEvents: [
      "Evening folk music at a heritage courtyard",
      "Seasonal craft demonstrations in local bazaars",
      "Temple aarti observed respectfully from public areas"
    ],
    generatedWith: {
      textModel: "demo",
      imageCount: 0,
      mode: "demo"
    }
  };
}

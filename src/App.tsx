import { Compass, Languages, Loader2, LocateFixed, MapPin, Sparkles, Volume2 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { requestStory } from "./api";
import { getCardTone, getProgressLabel } from "./lib/story";
import type { Coordinates, StoryRequest, StoryResponse } from "./types";

const interestOptions = ["heritage", "food", "hidden gems", "markets", "nature", "festivals"];
const storyStorageKey = "localore:last-story";

const starterStory: StoryResponse = {
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
      narrative:
        "Cardamom steam rises from clay cups. The smallest pause becomes the most local part of the day.",
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

function readStoredStory() {
  try {
    const stored = localStorage.getItem(storyStorageKey);
    return stored ? ({ ...starterStory, ...JSON.parse(stored) } as StoryResponse) : starterStory;
  } catch {
    return starterStory;
  }
}

function App() {
  const [destination, setDestination] = useState("Jaipur, India");
  const [profile, setProfile] = useState<StoryRequest["travelerProfile"]>("first-time");
  const [pace, setPace] = useState<StoryRequest["pace"]>("balanced");
  const [interests, setInterests] = useState(["heritage", "food", "hidden gems"]);
  const [includeImages, setIncludeImages] = useState(true);
  const [coordinates, setCoordinates] = useState<Coordinates>();
  const [activeCard, setActiveCard] = useState(0);
  const [story, setStory] = useState(readStoredStory);
  const [status, setStatus] = useState<"idle" | "locating" | "loading">("idle");
  const [error, setError] = useState("");

  const active = story.cards[activeCard] || story.cards[0];
  const locale = useMemo(() => navigator.language || "en-US", []);
  const timezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC", []);

  function toggleInterest(value: string) {
    setInterests((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value].slice(0, 6)
    );
  }

  function locate() {
    if (!navigator.geolocation) {
      setError("Location is unavailable in this browser.");
      return;
    }

    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setStatus("idle");
        setError("");
      },
      () => {
        setStatus("idle");
        setError("Location permission was not granted.");
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 }
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const nextStory = await requestStory({
        destination: destination.trim() || undefined,
        coordinates,
        locale,
        timezone,
        travelerProfile: profile,
        pace,
        interests: interests.length ? interests : ["heritage"],
        includeImages
      });
      setStory(nextStory);
      localStorage.setItem(storyStorageKey, JSON.stringify(nextStory));
      setActiveCard(0);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to generate the story.");
    } finally {
      setStatus("idle");
    }
  }

  return (
    <main className="app-shell">
      <section className="control-panel" aria-label="Story controls">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">
            <Sparkles size={18} />
          </span>
          <div>
            <p>Localore</p>
            <span>Gemini cultural story cards</span>
          </div>
        </div>

        <form onSubmit={submit} className="story-form">
          <label className="field">
            <span>Destination</span>
            <input
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              placeholder="Use my location or type a place"
              maxLength={90}
            />
          </label>

          <button className="secondary-button" type="button" onClick={locate} disabled={status !== "idle"}>
            {status === "locating" ? <Loader2 className="spin" size={18} /> : <LocateFixed size={18} />}
            Use my location
          </button>

          {coordinates ? (
            <p className="coordinate-chip">
              <MapPin size={14} />
              {coordinates.latitude.toFixed(3)}, {coordinates.longitude.toFixed(3)}
            </p>
          ) : null}

          <div className="field">
            <span>Traveler</span>
            <div className="segmented-control">
              {(["first-time", "food", "history", "weekend"] as const).map((item) => (
                <button
                  type="button"
                  key={item}
                  className={profile === item ? "selected" : ""}
                  onClick={() => setProfile(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <label className="field">
            <span>Pace</span>
            <select value={pace} onChange={(event) => setPace(event.target.value as StoryRequest["pace"])}>
              <option value="gentle">Gentle</option>
              <option value="balanced">Balanced</option>
              <option value="packed">Packed</option>
            </select>
          </label>

          <fieldset className="field chips">
            <legend>Interests</legend>
            {interestOptions.map((interest) => (
              <label key={interest} className={interests.includes(interest) ? "chip checked" : "chip"}>
                <input
                  type="checkbox"
                  checked={interests.includes(interest)}
                  onChange={() => toggleInterest(interest)}
                />
                {interest}
              </label>
            ))}
          </fieldset>

          <label className="toggle-row">
            <input type="checkbox" checked={includeImages} onChange={(event) => setIncludeImages(event.target.checked)} />
            Gemini image cards
          </label>

          <button className="primary-button" type="submit" disabled={status !== "idle"}>
            {status === "loading" ? <Loader2 className="spin" size={18} /> : <Compass size={18} />}
            Generate story
          </button>
        </form>

        {error ? <p className="error-message" role="alert">{error}</p> : null}
      </section>

      <section className="story-stage" aria-live="polite" aria-busy={status === "loading"}>
        <header className="story-header">
          <div>
            <p className="eyebrow">{story.region}</p>
            <h1>{story.title}</h1>
            <p>{story.subtitle}</p>
          </div>
          <div className="model-badge">
            <span>{story.generatedWith.mode}</span>
            <strong>{story.generatedWith.imageCount} images</strong>
          </div>
        </header>

        <div className="experience-grid">
          <article className="feature-card unfolding" style={getCardTone(active, activeCard)}>
            <div className={active.imageUrl ? "image-frame has-image" : "image-frame"} aria-label={active.imageAlt}>
              {active.imageUrl ? (
                <img src={active.imageUrl} alt={active.imageAlt} decoding="async" loading="eager" />
              ) : (
                <span>{active.place}</span>
              )}
            </div>
            <div className="card-copy">
              <p className="eyebrow">{getProgressLabel(activeCard, story.cards.length)} · {active.timeOfDay}</p>
              <h2>{active.title}</h2>
              <p>{active.narrative}</p>
              <div className="insight-row">
                <Languages size={18} />
                <span>{active.culturalInsight}</span>
              </div>
            </div>
          </article>

          <aside className="side-stack">
            <div className="phrase-panel">
              <div className="panel-title">
                <Volume2 size={18} />
                <span>{story.localLanguage}</span>
              </div>
              <strong>{active.localPhrase.local}</strong>
              <p>{active.localPhrase.transliteration}</p>
              <span>{active.localPhrase.meaning} · {active.localPhrase.usage}</span>
            </div>

            <div className="mini-panel">
              <h2>Hidden gem</h2>
              <p>{active.hiddenGem}</p>
            </div>

            <div className="mini-panel">
              <h2>Etiquette</h2>
              <ul>
                {story.etiquette.slice(0, 3).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <nav className="card-rail" aria-label="Story card navigation">
          {story.cards.map((card, index) => (
            <button
              key={card.id}
              type="button"
              className={index === activeCard ? "rail-card active" : "rail-card"}
              onClick={() => setActiveCard(index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{card.place}</strong>
            </button>
          ))}
        </nav>

        <section className="discovery-band" aria-label="Destination details">
          <div>
            <h2>Phrasebook</h2>
            <ul className="phrase-list">
              {story.phrasebook.map((phrase) => (
                <li key={`${phrase.local}-${phrase.meaning}`}>
                  <strong>{phrase.local}</strong>
                  <span>{phrase.meaning}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Local events</h2>
            <ul>
              {story.localEvents.map((event) => (
                <li key={event}>{event}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Safety</h2>
            <p>{story.safetyTip}</p>
            <span className="best-time">{story.bestTime}</span>
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;

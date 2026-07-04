import { Compass, Loader2, LocateFixed, MapPin, Sparkles } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { requestStory } from "./api";
import { StoryStage } from "./components/StoryStage";
import { readStoredStory, saveStory } from "./lib/storyStorage";
import type { Coordinates, StoryRequest } from "./types";

const interestOptions = ["heritage", "food", "hidden gems", "markets", "nature", "festivals"];

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
      saveStory(nextStory);
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

        {error ? (
          <p className="error-message" role="alert">
            {error}
          </p>
        ) : null}
      </section>

      <StoryStage story={story} activeCard={activeCard} busy={status === "loading"} onSelectCard={setActiveCard} />
    </main>
  );
}

export default App;

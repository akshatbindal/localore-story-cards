import { Languages, Volume2 } from "lucide-react";
import { getCardTone, getProgressLabel } from "../lib/story";
import type { StoryResponse } from "../types";

type StoryStageProps = {
  activeCard: number;
  busy: boolean;
  onSelectCard: (index: number) => void;
  story: StoryResponse;
};

export function StoryStage({ activeCard, busy, onSelectCard, story }: StoryStageProps) {
  const active = story.cards[activeCard] || story.cards[0];

  return (
    <section className="story-stage" aria-live="polite" aria-busy={busy}>
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
            <p className="eyebrow">
              {getProgressLabel(activeCard, story.cards.length)} · {active.timeOfDay}
            </p>
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
            <span>
              {active.localPhrase.meaning} · {active.localPhrase.usage}
            </span>
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
            onClick={() => onSelectCard(index)}
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
  );
}

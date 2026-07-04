import type { CSSProperties } from "react";
import type { StoryCard } from "../types";

export function getProgressLabel(index: number, total: number) {
  return `Card ${Math.min(index + 1, total)} of ${total}`;
}

export function getCardTone(card: StoryCard, index: number) {
  const seed = `${card.title} ${card.place}`.length + index * 17;
  const hue = seed % 360;
  return {
    "--tone-a": `hsl(${hue} 74% 38%)`,
    "--tone-b": `hsl(${(hue + 54) % 360} 78% 52%)`,
    "--tone-c": `hsl(${(hue + 126) % 360} 64% 42%)`
  } as CSSProperties;
}

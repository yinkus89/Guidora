// src/lib/suggestions.ts

type SuggestParams = {
  category: string; // e.g. "financial"
  country: string;  // e.g. "DE"
  answers: Record<string, string>;
};

// Very simple rule map: "{category}:{country}" -> related category ids (strings)
const MAP: Record<string, string[]> = {
  "financial:DE": ["education", "environment"],
  "financial:US": ["education"],
  "financial:UK": ["education", "social"],

  "education:DE": ["financial"],
  "education:US": ["financial"],
};

// Optional: answer-based tweaks
function answerAdjust(base: string[], answers: Record<string, string>) {
  const out = [...base];
  // Example: long-term difficulty → suggest social support
  if (answers.duration === "6_plus_months" && !out.includes("social")) {
    out.push("social");
  }
  // Example: said "yes" to contact → nudge environment (safety) resources
  if (answers.contact === "yes" && !out.includes("environment")) {
    out.push("environment");
  }
  return out;
}

export function getSuggestions({ category, country, answers }: SuggestParams): string[] {
  const key = `${category}:${country}`;
  const base = MAP[key] || [];
  return answerAdjust(base, answers);
}

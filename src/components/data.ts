export const COUNTRIES = [
  { code: "DE", name: "Germany" },
  { code: "US", name: "USA" },
  { code: "UK", name: "United Kingdom" },
  { code: "IT", name: "Italy" },
  { code: "BE", name: "Belgium" }
];
export type CategoryMeta = {
  id: string;
  name: string;
  description?: string; // <-- optional
};
export const CATEGORIES = [
  { id: "health", name: "Physical & Health" },
  { id: "emotional", name: "Emotional & Psychological" },
  { id: "financial", name: "Financial & Economic" },
  { id: "social", name: "Social & Relationship" },
  { id: "education", name: "Educational & Career" },
  { id: "environment", name: "Environmental & Living" },
  { id: "spiritual", name: "Moral & Spiritual" }
];

export const QUOTES = [
  "No storm lasts forever.",
  "You are stronger than you think.",
  "Small steps lead to big change."
];

export const LINKS: Record<string, { country: string; name: string; url: string; }[]> = {
  emotional: [
    { country: "DE", name: "Telefonseelsorge", url: "https://www.telefonseelsorge.de" },
    { country: "US", name: "988 Suicide & Crisis Lifeline", url: "https://988lifeline.org" },
  ],
  financial: [
    { country: "DE", name: "Jobcenter Info", url: "https://www.arbeitsagentur.de" },
    { country: "US", name: "Benefits.gov", url: "https://www.benefits.gov" },
  ]
};

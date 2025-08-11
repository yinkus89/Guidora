// src/lib/storage.ts
export type SavedPlan = {
  id: string;
  createdAt: string; // ISO string
  category: string;
  country: string;
  answers: Record<string, string>;
};

export type UserPrefs = {
  lang?: string;
  country?: string;
  favorites?: string[]; // category IDs
};

export type Visit = { category: string; ts: number };

const PLANS_KEY = "guidora.savedPlans";
const PREFS_KEY = "guidora.preferences";
const VISITS_KEY = "guidora.visits";

/* ---------- Plans ---------- */
export function loadPlans(): SavedPlan[] {
  return JSON.parse(localStorage.getItem(PLANS_KEY) || "[]");
}

export function savePlan(plan: {
  category: string;
  country: string;
  answers: Record<string, string>;
}): SavedPlan {
  const existing: SavedPlan[] = loadPlans();
  const entry: SavedPlan = {
    id: crypto.randomUUID?.() ?? String(Date.now()),
    createdAt: new Date().toISOString(),
    category: plan.category,
    country: plan.country,
    answers: plan.answers,
  };
  const next = [entry, ...existing].slice(0, 50);
  localStorage.setItem(PLANS_KEY, JSON.stringify(next));
  return entry;
}

export function deletePlan(id: string) {
  const next = loadPlans().filter((p) => p.id !== id);
  localStorage.setItem(PLANS_KEY, JSON.stringify(next));
}

/* ---------- Preferences ---------- */
export function loadPrefs(): UserPrefs {
  return JSON.parse(localStorage.getItem(PREFS_KEY) || "{}");
}

export function savePrefs(prefs: UserPrefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

/* ---------- Progress / Visits ---------- */
export function trackVisit(category: string) {
  const visits: Visit[] = JSON.parse(localStorage.getItem(VISITS_KEY) || "[]");
  visits.unshift({ category, ts: Date.now() });
  const trimmed = visits.slice(0, 200); // keep most recent 200
  localStorage.setItem(VISITS_KEY, JSON.stringify(trimmed));
}

export function getWeeklyStats(): { uniqueCategories: number; totalVisits: number } {
  const visits: Visit[] = JSON.parse(localStorage.getItem(VISITS_KEY) || "[]");
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recent = visits.filter((v) => v.ts >= weekAgo);
  const unique = new Set(recent.map((v) => v.category));
  return { uniqueCategories: unique.size, totalVisits: recent.length };
}

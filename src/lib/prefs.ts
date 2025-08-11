export type UserPrefs = {
  defaultCountry?: string;
  favoriteCategories?: string[];
};

const KEY = "guidora.userPrefs";

export function loadPrefs(): UserPrefs {
  return JSON.parse(localStorage.getItem(KEY) || "{}");
}

export function savePrefs(prefs: UserPrefs) {
  localStorage.setItem(KEY, JSON.stringify(prefs));
}

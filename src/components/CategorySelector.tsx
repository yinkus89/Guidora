import { CATEGORIES } from "./data";
import { Star } from "lucide-react";

interface CategorySelectorProps {
  setCategory: (v: string) => void;
  favorites: string[];
  setFavorites: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function CategorySelector({
  setCategory,
  favorites,
  setFavorites,
}: CategorySelectorProps) {
  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // Favorites first, then alphabetical by name
  const sorted = [...CATEGORIES].sort((a, b) => {
    const aFav = favorites.includes(a.id);
    const bFav = favorites.includes(b.id);
    if (aFav !== bFav) return aFav ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {sorted.map((c) => {
        const isFav = favorites.includes(c.id);
        return (
          <div
            key={c.id}
            className="group relative p-6 bg-purple-50 border border-purple-200 rounded-xl shadow-sm hover:shadow-lg hover:bg-purple-100 transition-all"
          >
            {/* Favorite toggle */}
            <button
              type="button"
              onClick={() => toggleFavorite(c.id)}
              className="absolute top-3 right-3 text-yellow-400 hover:text-yellow-500"
              aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className={`h-5 w-5 ${isFav ? "fill-yellow-400" : "fill-none"}`} />
            </button>

            {/* Select category */}
            <button onClick={() => setCategory(c.id)} className="text-left w-full">
              <h3 className="font-semibold text-lg text-purple-800 group-hover:text-purple-900 flex items-center gap-2">
                {c.name}
                {isFav && <span className="text-xs text-yellow-500">(Fav)</span>}
              </h3>
            </button>
          </div>
        );
      })}
    </div>
  );
}

import { CATEGORIES } from "./data";

interface CategorySelectorProps {
  setCategory: (v: string) => void;
}

export default function CategorySelector({ setCategory }: CategorySelectorProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {CATEGORIES.map((c) => (
        <button
          key={c.id}
          onClick={() => setCategory(c.id)}
          className="group p-5 rounded-xl border bg-purple-50/70 border-purple-200 text-left transition
                     hover:bg-purple-100 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
        >
          <h3 className="font-semibold text-lg text-purple-900 group-hover:text-purple-950">
            {c.name}
          </h3>
          {/* If you later add c.description, it will still look nice */}
        </button>
      ))}
    </div>
  );
}

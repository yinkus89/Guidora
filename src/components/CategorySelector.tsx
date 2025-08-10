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
          className="group p-6 bg-purple-50 border border-purple-200 rounded-xl shadow-sm hover:shadow-lg hover:bg-purple-100 transition-all text-left"
        >
          <h3 className="font-semibold text-lg text-purple-800 group-hover:text-purple-900">
            {c.name}
          </h3>
        </button>
      ))}
    </div>
  );
}

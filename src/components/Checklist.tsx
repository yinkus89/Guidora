import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEFAULT_CHECKLIST } from "@/lib/checklists";
import { loadChecklist, saveChecklist, type ChecklistItem } from "@/lib/storage";
import { CheckCircle2, RotateCcw } from "lucide-react";

export default function Checklist({
  country,
  category,
  title = "Checklist",
}: {
  country: string;
  category: string;
  title?: string;
}) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newText, setNewText] = useState("");

  // seed on mount from storage or defaults
  useEffect(() => {
    const existing = loadChecklist(country, category);
    if (existing.length) {
      setItems(existing);
    } else {
      const seeds = (DEFAULT_CHECKLIST[category] || []).map((text, i) => ({
        id: `${category}-${i}`,
        text,
        done: false,
      }));
      setItems(seeds);
    }
  }, [country, category]);

  // persist whenever items change
  useEffect(() => {
    saveChecklist(country, category, items);
  }, [country, category, items]);

  const completed = useMemo(() => items.filter(i => i.done).length, [items]);

  const toggle = (id: string) =>
    setItems(prev => prev.map(i => (i.id === id ? { ...i, done: !i.done } : i)));

  const addItem = () => {
    const text = newText.trim();
    if (!text) return;
    setItems(prev => [{ id: crypto.randomUUID?.() ?? String(Date.now()), text, done: false }, ...prev]);
    setNewText("");
  };

  const reset = () => {
    const seeds = (DEFAULT_CHECKLIST[category] || []).map((text, i) => ({
      id: `${category}-${i}`,
      text,
      done: false,
    }));
    setItems(seeds);
  };

  return (
    <div className="rounded-xl border border-purple-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-purple-800">{title}</h3>
        <div className="text-sm text-purple-700">
          {completed}/{items.length} done
        </div>
      </div>

      {/* add item */}
      <div className="flex gap-2 mb-3">
        <Input
          value={newText}
          onChange={e => setNewText(e.target.value)}
          placeholder="Add a step…"
        />
        <Button variant="outline" onClick={addItem}>
          Add
        </Button>
        <Button variant="ghost" onClick={reset} title="Reset to defaults">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <ul className="space-y-2">
        {items.map(item => (
          <li
            key={item.id}
            className="flex items-center gap-3 rounded-lg border border-purple-100 bg-purple-50 px-3 py-2"
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="shrink-0"
              aria-label={item.done ? "Mark as not done" : "Mark as done"}
            >
              <CheckCircle2
                className={`h-5 w-5 ${item.done ? "text-emerald-600" : "text-gray-400"}`}
              />
            </button>
            <span className={`text-sm ${item.done ? "line-through text-gray-500" : "text-gray-800"}`}>
              {item.text}
            </span>
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-sm text-gray-500">No steps yet. Add your first one!</li>
        )}
      </ul>
    </div>
  );
}

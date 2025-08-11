import { Trash2, Calendar, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SavedPlan } from "@/lib/storage";
import { CATEGORIES } from "./data";

// Updated to handle both string and number timestamps
function fmtDate(ts: string | number) {
  const d = new Date(ts);
  return d.toLocaleString();
}

export default function SavedPlans({
  plans,
  onDelete,
  onLoad,
  onClose,
}: {
  plans: SavedPlan[];
  onDelete: (id: string) => void;
  onLoad: (plan: SavedPlan) => void;
  onClose: () => void;
}) {
  // Sort newest first
  const sortedPlans = [...plans].sort((a, b) => Number(b.createdAt) - Number(a.createdAt));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-purple-800">Saved Plans</h2>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      {sortedPlans.length === 0 ? (
        <p className="text-sm text-gray-600">No saved plans yet.</p>
      ) : (
        <ul className="grid gap-3">
          {sortedPlans.map((p) => {
            const cat = CATEGORIES.find((c) => c.id === p.category);
            return (
              <li
                key={p.id}
                className="rounded-xl border border-purple-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-purple-900">
                      {cat?.name || p.category} • {p.country}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {fmtDate(p.createdAt)}
                    </div>
                    {Object.keys(p.answers).length > 0 && (
                      <div className="text-xs text-gray-600 mt-2">
                        {Object.entries(p.answers)
                          .slice(0, 2)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join("  •  ")}
                        {Object.keys(p.answers).length > 2 ? "  •  …" : ""}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => onLoad(p)}>
                      <Undo2 className="h-4 w-4 mr-1" /> Load
                    </Button>
                    <Button variant="destructive" onClick={() => onDelete(p.id)}>
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

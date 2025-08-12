import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";

type FeedbackCounts = { up: number; down: number };
const KEY = "guidora.feedback.v1";

function loadAll(): Record<string, FeedbackCounts> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function saveAll(map: Record<string, FeedbackCounts>) {
  localStorage.setItem(KEY, JSON.stringify(map));
}

export default function FeedbackBar({
  category,
  country,
}: {
  category: string;
  country: string;
}) {
  const id = `${country}:${category}`;
  const [counts, setCounts] = useState<FeedbackCounts>({ up: 0, down: 0 });
  const [voted, setVoted] = useState<"up" | "down" | null>(null);

  // load counts
  useEffect(() => {
    const all = loadAll();
    setCounts(all[id] || { up: 0, down: 0 });
  }, [id]);

  const vote = (kind: "up" | "down") => {
    if (voted) return; // one vote per session (simple)
    const all = loadAll();
    const cur = all[id] || { up: 0, down: 0 };
    const next =
      kind === "up" ? { ...cur, up: cur.up + 1 } : { ...cur, down: cur.down + 1 };
    all[id] = next;
    saveAll(all);
    setCounts(next);
    setVoted(kind);
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-purple-200 bg-purple-50 p-3">
      <div className="text-sm text-purple-900 font-medium">
        Was this helpful? <span className="text-gray-600">(anonymous)</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => vote("up")}
          disabled={!!voted}
          className="gap-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          aria-pressed={voted === "up"}
        >
          <ThumbsUp className="h-4 w-4" />
          {counts.up}
        </Button>
        <Button
          variant="outline"
          onClick={() => vote("down")}
          disabled={!!voted}
          className="gap-1 border-rose-300 text-rose-700 hover:bg-rose-50"
          aria-pressed={voted === "down"}
        >
          <ThumbsDown className="h-4 w-4" />
          {counts.down}
        </Button>
      </div>
    </div>
  );
}

// src/components/Suggestions.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function Suggestions({
  suggestions,
  title = "Related suggestions",
  onPick,
}: {
  suggestions: string[];
  title?: string;
  onPick?: (label: string) => void;
}) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <Card className="border-purple-200 bg-purple-50/60">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-purple-700" />
          <h3 className="text-sm font-semibold text-purple-800">{title}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <Button
              key={s}
              variant="outline"
              className="border-purple-300 text-purple-800 hover:bg-purple-100"
              onClick={() => onPick?.(s)}
              type="button"
            >
              {s}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

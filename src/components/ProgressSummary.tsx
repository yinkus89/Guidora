// src/components/ProgressSummary.tsx
import { BarChart3, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function ProgressSummary({
  weeklyUnique,
  weeklyTotal,
  planPercent,
}: {
  weeklyUnique: number;
  weeklyTotal: number;
  planPercent: number;
}) {
  return (
    <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-purple-800">
          <BarChart3 className="h-5 w-5" />
          <span className="font-semibold">
            Weekly activity: {weeklyUnique} categories / {weeklyTotal} visits
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-emerald-700">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">Plan progress</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Progress value={planPercent} className="h-2 flex-1" />
        <span className="text-sm text-purple-700 font-semibold w-14 text-right">
          {Math.round(planPercent)}%
        </span>
      </div>
    </div>
  );
}

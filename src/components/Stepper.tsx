import { Progress } from "@/components/ui/progress";

interface StepperProps {
  step: number;  // 0..(total-1)
  total: number; // e.g., 3
}

export default function Stepper({ step, total }: StepperProps) {
  const pct = Math.max(0, Math.min(100, Math.round(((step + 1) / total) * 100)));
  return (
    <div className="w-full space-y-3">
      <Progress value={pct} className="h-3 rounded-full" />
      <div className="flex justify-between text-sm text-gray-600">
        <span>
          Step <span className="font-semibold">{step + 1}</span> of{" "}
          <span className="font-semibold">{total}</span>
        </span>
        <span className="text-purple-700 font-medium">{pct}%</span>
      </div>
    </div>
  );
}

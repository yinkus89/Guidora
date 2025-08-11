import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Answers = {
  goal?: "job" | "health" | "safety" | "learning" | "money";
  urgency?: "now" | "soon";
  duration?: "short" | "long";
  contact?: "yes" | "no";
};

export default function MiniQuiz({
  onClose,
  onComplete,
}: {
  onClose: () => void;
  onComplete: (result: { category: string; reason: string }) => void;
}) {
  const [a, setA] = React.useState<Answers>({});

  const canSubmit = a.goal && a.urgency && a.duration && a.contact;

  const computeResult = (): { category: string; reason: string } => {
    // simple routing heuristic
    if (a.goal === "safety") {
      return {
        category: "social",
        reason: "Safety & relationships support is most relevant.",
      };
    }
    if (a.goal === "health") {
      return { category: "health", reason: "A health checkup and support resources can help." };
    }
    if (a.goal === "learning") {
      return { category: "education", reason: "Training and skills resources are a good next step." };
    }
    if (a.goal === "money") {
      return { category: "financial", reason: "Financial guidance and assistance programs fit best." };
    }
    // default: job/career
    return { category: "education", reason: "Education & skills can support your job search." };
  };

  const submit = () => {
    if (!canSubmit) return;
    onComplete(computeResult());
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-purple-800">Quick quiz</h2>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>

      {/* Q1: goal */}
      <div className="space-y-2">
        <Label>What’s your main objective right now?</Label>
        <Select
          value={a.goal}
          onValueChange={(v: any) => setA((p) => ({ ...p, goal: v }))}
        >
          <SelectTrigger><SelectValue placeholder="Choose one" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="job">Find work / improve career</SelectItem>
            <SelectItem value="learning">Learn skills / study</SelectItem>
            <SelectItem value="money">Manage money / support</SelectItem>
            <SelectItem value="health">Health / wellbeing</SelectItem>
            <SelectItem value="safety">Safety / relationships</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Q2: urgency */}
      <div className="space-y-2">
        <Label>How urgent is it?</Label>
        <RadioGroup
          value={a.urgency}
          onValueChange={(v: any) => setA((p) => ({ ...p, urgency: v }))}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem id="urg-now" value="now" />
            <Label htmlFor="urg-now">Very urgent</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem id="urg-soon" value="soon" />
            <Label htmlFor="urg-soon">Soon / planning</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Q3: duration */}
      <div className="space-y-2">
        <Label>How long has this been a challenge?</Label>
        <RadioGroup
          value={a.duration}
          onValueChange={(v: any) => setA((p) => ({ ...p, duration: v }))}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem id="dur-short" value="short" />
            <Label htmlFor="dur-short">Under 6 months</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem id="dur-long" value="long" />
            <Label htmlFor="dur-long">6+ months</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Q4: contact */}
      <div className="space-y-2">
        <Label>Open to being contacted by support services?</Label>
        <RadioGroup
          value={a.contact}
          onValueChange={(v: any) => setA((p) => ({ ...p, contact: v }))}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem id="c-yes" value="yes" />
            <Label htmlFor="c-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem id="c-no" value="no" />
            <Label htmlFor="c-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="pt-2 flex items-center justify-between">
        <div className="text-xs text-gray-500">Takes ~30 seconds</div>
        <Button disabled={!canSubmit} onClick={submit}>Show my best starting point</Button>
      </div>
    </div>
  );
}

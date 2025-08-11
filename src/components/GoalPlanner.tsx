import React from "react";
import { loadGoals, saveGoals, type Goal } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, BellOff, CheckCircle2, Plus, Trash2, X } from "lucide-react";

type Props = {
  onClose: () => void;
};

export default function GoalPlanner({ onClose }: Props) {
  const [goals, setGoals] = React.useState<Goal[]>([]);
  const [title, setTitle] = React.useState("");
  const [due, setDue] = React.useState<string>(""); // YYYY-MM-DD
  const [notify, setNotify] = React.useState(false);
  const [perm, setPerm] = React.useState<NotificationPermission>("default");

  React.useEffect(() => {
    setGoals(loadGoals());
    if ("Notification" in window) {
      setPerm(Notification.permission);
    }
  }, []);

  const askPermission = async () => {
    if (!("Notification" in window)) return;
    try {
      const res = await Notification.requestPermission();
      setPerm(res);
    } catch {}
  };

  const addGoal = () => {
    if (!title.trim()) return;
    const g: Goal = {
      id: crypto.randomUUID?.() ?? String(Date.now()),
      title: title.trim(),
      due: due || undefined,
      done: false,
      createdAt: new Date().toISOString(),
    };
    const next = [g, ...goals];
    setGoals(next);
    saveGoals(next);

    // best-effort local reminder (while app is open)
    if (notify && "Notification" in window && Notification.permission === "granted" && g.due) {
      const when = new Date(g.due + "T09:00:00"); // morning reminder
      const ms = when.getTime() - Date.now();
      if (ms > 0 && ms < 1000 * 60 * 60 * 24 * 365) {
        setTimeout(() => {
          try {
            new Notification("Goal due today", {
              body: g.title,
              tag: g.id,
            });
          } catch {}
        }, ms);
      }
    }

    setTitle("");
    setDue("");
    setNotify(false);
  };

  const toggleDone = (id: string) => {
    const next = goals.map((g) => (g.id === id ? { ...g, done: !g.done } : g));
    setGoals(next);
    saveGoals(next);
  };

  const removeGoal = (id: string) => {
    const next = goals.filter((g) => g.id !== id);
    setGoals(next);
    saveGoals(next);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-purple-800">Goal Planner</h2>
        <Button variant="outline" onClick={onClose}>
          <X className="h-4 w-4 mr-1" /> Close
        </Button>
      </div>

      {/* New goal form */}
      <div className="rounded-xl border border-purple-200 p-4 bg-purple-50/50">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <Label htmlFor="g-title">Goal</Label>
            <Input
              id="g-title"
              placeholder="e.g., Book appointment / Apply to 3 jobs"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="g-due">Due date</Label>
            <Input
              id="g-due"
              type="date"
              value={due}
              onChange={(e) => setDue(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={() => setNotify((v) => !v)}>
              {notify ? (
                <>
                  <Bell className="h-4 w-4 mr-1" /> Reminder on
                </>
              ) : (
                <>
                  <BellOff className="h-4 w-4 mr-1" /> Reminder off
                </>
              )}
            </Button>
            {"Notification" in window && perm !== "granted" && (
              <Button type="button" variant="ghost" onClick={askPermission}>
                Allow notifications
              </Button>
            )}
          </div>

          <Button type="button" onClick={addGoal}>
            <Plus className="h-4 w-4 mr-1" /> Add goal
          </Button>
        </div>
      </div>

      {/* List */}
      {goals.length === 0 ? (
        <p className="text-sm text-gray-600">No goals yet. Add your first one!</p>
      ) : (
        <ul className="space-y-2">
          {goals.map((g) => (
            <li
              key={g.id}
              className="flex items-center justify-between rounded-xl border p-3 bg-white"
            >
              <div className="flex items-center gap-3">
                <button
                  className={`inline-flex items-center justify-center rounded-full border h-6 w-6 ${
                    g.done ? "bg-emerald-100 border-emerald-400" : "border-gray-300"
                  }`}
                  onClick={() => toggleDone(g.id)}
                  title={g.done ? "Mark as not done" : "Mark as done"}
                >
                  {g.done && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                </button>
                <div>
                  <div className={`font-medium ${g.done ? "line-through text-gray-400" : ""}`}>
                    {g.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {g.due ? `Due: ${g.due}` : "No due date"}
                  </div>
                </div>
              </div>

              <Button variant="destructive" onClick={() => removeGoal(g.id)}>
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

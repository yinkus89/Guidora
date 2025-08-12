import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";

type Submission = {
  id: string;
  ts: number;
  country: string;
  category: string;
  label: string;
  url: string;
};

const KEY = "guidora.submissions.v1";

function loadAll(): Submission[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function saveAll(list: Submission[]) {
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 200)));
}

export default function SubmitResource({
  country,
  category,
}: {
  country: string;
  category: string;
}) {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [msg, setMsg] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedLabel = label.trim();
    const trimmedUrl = url.trim();

    if (!trimmedLabel || !trimmedUrl) {
      setMsg("Please enter a title and a valid URL.");
      return;
    }
    try {
      // very light validation
      const ok = /^https?:\/\//i.test(trimmedUrl);
      if (!ok) {
        setMsg("URL must start with http:// or https://");
        return;
      }

      const all = loadAll();
      const entry: Submission = {
        id: crypto.randomUUID?.() ?? String(Date.now()),
        ts: Date.now(),
        country,
        category,
        label: trimmedLabel,
        url: trimmedUrl,
      };
      all.unshift(entry);
      saveAll(all);
      setMsg("Thanks! Your suggestion was saved for review.");
      setLabel("");
      setUrl("");
    } catch {
      setMsg("Could not save your suggestion. Please check browser storage settings.");
    }
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border border-purple-200 bg-white p-4 shadow-sm space-y-3"
    >
      <div className="text-sm font-semibold text-purple-800">
        Suggest a helpful link for others
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="res-label">Title</Label>
          <Input
            id="res-label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Free counseling hotline"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="res-url">URL</Label>
          <Input
            id="res-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.org/help"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" className="gap-2">
          <Send className="h-4 w-4" />
          Submit
        </Button>
        {msg && <span className="text-sm text-gray-600">{msg}</span>}
      </div>

      <p className="text-xs text-gray-500">
        Submissions are stored locally on your device for now. A moderator review
        flow can be added later.
      </p>
    </form>
  );
}

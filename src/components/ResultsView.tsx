import { I18N } from "./i18n";
import type { Lang } from "./i18n";
import {
  CATEGORIES,
  CATEGORY_TIPS,
  RESOURCE_LINKS,
  EMERGENCY_LINKS,
  type Category,
} from "./data";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  FileQuestion,
  Link2,
  Lightbulb,
  Sparkles,
} from "lucide-react";

interface ResultsViewProps {
  category: string;
  country: string;
  answers?: Record<string, string>;
  lang?: Lang;
}

export default function ResultsView({
  category,
  country,
  answers = {},
  lang = "en",
}: ResultsViewProps) {
  const t = (key: string) => I18N[lang][key] || key;

  // Resolve category object & its type
  const cat: Category | undefined = CATEGORIES.find((c) => c.id === category);
  const type: "emergency" | "resources" = cat?.type ?? "resources";

  // Tips
  const tips = CATEGORY_TIPS[category] || [];

  // Resource links (category → country → links, fallback to GLB)
  const byCountry = RESOURCE_LINKS[category] || {};
  const resourceLinks = byCountry[country] || byCountry["GLB"] || [];

  // Emergency links (only when category is emergency)
  const emergencyLinks =
    type === "emergency"
      ? EMERGENCY_LINKS[country] || EMERGENCY_LINKS["GLB"]
      : [];

  // Quotes (unchanged)
  const quotes = [
    "You are stronger than you think.",
    "This too shall pass.",
    "Small steps every day lead to big changes.",
    "You’ve survived 100% of your hardest days.",
  ];
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-purple-600" />
        <h2 className="text-xl font-bold text-purple-800">
          {t("yourPlan")} {cat ? `— ${cat.name}` : ""}
        </h2>
      </div>

      {/* Emergency notice */}
      {type === "emergency" && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800">
                If this is urgent or someone is at immediate risk, contact local emergency services.
              </p>
              {emergencyLinks?.length > 0 && (
                <ul className="mt-2 list-disc pl-5 text-sm">
                  {emergencyLinks.map((l, i) => (
                    <li key={i}>
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-700 hover:underline inline-flex items-center gap-1"
                      >
                        {l.label} <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="grid gap-3">
        {(tips.length ? tips : [t("No advice available for this category.")]).map(
          (tip, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl border border-purple-200 bg-purple-50 p-4"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0 text-purple-700 mt-0.5" />
              <p className="text-sm text-gray-800">{tip}</p>
            </div>
          )
        )}
      </div>

      {/* Answers summary */}
      {Object.keys(answers).length > 0 && (
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-2">{t("Your Answers")}:</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            {Object.entries(answers).map(([q, a], idx) => (
              <li key={idx} className="flex justify-between gap-4">
                <span className="text-gray-500">{q}</span>
                <span className="font-medium">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Resource links */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">
            {t("supportLinks")} ({country})
          </h3>
        </div>

        {resourceLinks.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {resourceLinks.map((l, idx) => (
              <a
                key={idx}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-purple-300 bg-white px-4 py-2 text-sm text-purple-800 shadow-sm hover:bg-purple-50 transition"
              >
                <ExternalLink className="h-4 w-4" />
                {l.label}
              </a>
            ))}
          </div>
        ) : (
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <FileQuestion className="h-4 w-4 mt-0.5" />
            <span>{t("No support links found for your country.")}</span>
          </div>
        )}
      </div>

      {/* Encouragement */}
      <div className="rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-white p-4">
        <div className="flex items-center gap-2 text-purple-700 mb-1">
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-medium">{t("encouragement")}</span>
        </div>
        <p className="text-purple-900 font-semibold italic">“{quote}”</p>
      </div>
    </div>
  );
}

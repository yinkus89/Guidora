import { I18N } from "./i18n";
import type { Lang } from "./i18n";
import { CheckCircle2, Lightbulb, Link2, Sparkles } from "lucide-react";

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

  // Category tips (expand as you like)
  const categoryTips: Record<string, string[]> = {
    financial: [
      "Create a budget and track your expenses.",
      "Seek local financial counseling services.",
      "Look for skill-based side income opportunities.",
    ],
    mental: [
      "Talk to a trusted friend or counselor.",
      "Practice daily mindfulness or meditation.",
      "Take regular breaks and maintain a healthy routine.",
    ],
    health: [
      "Consult a medical professional for advice.",
      "Adopt a balanced diet and regular exercise routine.",
      "Avoid self-diagnosis — rely on certified health sources.",
    ],
  };

  const supportLinks: Record<string, { label: string; url: string }[]> = {
    DE: [
      { label: "Telefonseelsorge (24/7)", url: "https://www.telefonseelsorge.de" },
      { label: "Beratungsstellen", url: "https://www.beratung.de" },
    ],
    US: [
      { label: "988 Suicide & Crisis Lifeline", url: "https://988lifeline.org" },
      { label: "Mental Health America", url: "https://www.mhanational.org" },
    ],
    UK: [
      { label: "Samaritans", url: "https://www.samaritans.org" },
      { label: "Mind UK", url: "https://www.mind.org.uk" },
    ],
    IT: [{ label: "Telefono Amico Italia", url: "https://www.telefonoamico.it" }],
    BE: [{ label: "Tele-Onthaal", url: "https://www.tele-onthaal.be" }],
  };

  const quotes = [
    "You are stronger than you think.",
    "This too shall pass.",
    "Small steps every day lead to big changes.",
    "You’ve survived 100% of your hardest days.",
  ];

  const tips = categoryTips[category] ?? [];
  const links = supportLinks[country] ?? [];
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-purple-600" />
        <h2 className="text-xl font-bold text-purple-800">{t("yourPlan")}</h2>
      </div>

      {/* Tips */}
      <div className="grid gap-3">
        {(tips.length ? tips : [t("No advice available for this category.")]).map((tip, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-xl border border-purple-200 bg-purple-50 p-4"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0 text-purple-700 mt-0.5" />
            <p className="text-sm text-gray-800">{tip}</p>
          </div>
        ))}
      </div>

      {/* Answers summary (optional) */}
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

      {/* Support links */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">
            {t("supportLinks")} ({country})
          </h3>
        </div>

        {links.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {links.map((l, idx) => (
              <a
                key={idx}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-purple-300 bg-white px-4 py-2 text-sm text-purple-800 shadow-sm hover:bg-purple-50 transition"
              >
                <Link2 className="h-4 w-4" />
                {l.label}
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">{t("No support links found for your country.")}</p>
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

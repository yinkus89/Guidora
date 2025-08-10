import type { Lang } from "@/components/i18n";

export default function Footer({ lang }: { lang: Lang }) {
  const year = new Date().getFullYear();
  const disclaimer =
    lang === "de"
      ? "Hinweis: Diese App ersetzt keine professionelle Hilfe."
      : "Note: This app does not replace professional help.";

  return (
    <footer className="mt-10 rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 p-5 text-center">
      <p className="text-sm text-gray-700">{disclaimer}</p>
      <div className="mt-2 text-xs text-gray-500">
        © {year} Guidora — All rights reserved
      </div>
    </footer>
  );
}

import { COUNTRIES } from "./data";
import type { Lang } from "@/components/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Sparkles } from "lucide-react";
import InstallButton from "./InstallButton";

interface HeaderProps {
  lang: Lang;
  setLang: (v: Lang) => void;
  country: string;
  setCountry: (v: string) => void;
  t: (k: string) => string;
}

export default function Header({ lang, setLang, country, setCountry, t }: HeaderProps) {
  return (
    <header className="flex items-center justify-between pb-6 border-b">
      {/* App name/logo on left */}
      <h1 className="text-2xl font-bold flex items-center gap-2 text-purple-800">
        <Sparkles className="h-6 w-6" aria-hidden="true" /> {t("appTitle")}
      </h1>

      {/* Right: Install + Language + Country */}
      <div className="flex items-center gap-3">
        {/* Install button (hidden on very small screens if you like) */}
        <InstallButton className="hidden sm:inline-flex" />

        {/* Language */}
        <Select value={lang} onValueChange={(v) => setLang(v as Lang)}>
          <SelectTrigger className="w-[140px]" aria-label={t("language")}>
            <SelectValue placeholder={t("language")} />
          </SelectTrigger>
          <SelectContent className="z-50" position="popper" sideOffset={4}>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="de">Deutsch</SelectItem>
          </SelectContent>
        </Select>

        {/* Country */}
        <Select value={country} onValueChange={(v) => setCountry(v)}>
          <SelectTrigger className="w-[180px]" aria-label={t("country")}>
            <SelectValue placeholder={t("country")} />
          </SelectTrigger>
          <SelectContent className="z-50" position="popper" sideOffset={4}>
            {COUNTRIES.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}

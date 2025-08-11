import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Stepper from "./components/Stepper";
import CategorySelector from "./components/CategorySelector";
import ResultsView from "./components/ResultsView";
import QuestionForm from "./components/QuestionForm";
import SavedPlans from "./components/SavedPlans";
import ProgressSummary from "./components/ProgressSummary";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import type { Lang } from "./components/i18n";
import { I18N } from "./components/i18n";
import {
  loadPlans,
  savePlan,
  deletePlan,
  loadPrefs,
  savePrefs,
  trackVisit,
  getWeeklyStats,
  type SavedPlan,
  type UserPrefs,
} from "@/lib/storage";

export default function App() {
  const [lang, setLang] = useState<Lang>("en");
  const [country, setCountry] = useState("DE");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<string | null>(null);
  const [formAnswers, setFormAnswers] = useState<Record<string, string>>({});
  const [savedMsg, setSavedMsg] = useState("");
  const [savedOpen, setSavedOpen] = useState(false);
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [weeklyUnique, setWeeklyUnique] = useState(0);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

  const t = (key: string) => I18N[lang][key] || key;
  const TOTAL_STEPS = 3;

  // Plan completion %
  const planPercent = useMemo(() => {
    const required = ["duration", "contact"];
    const answered = required.filter((k) => !!formAnswers[k]).length;
    let pct = (answered / required.length) * 90;
    if (formAnswers.age) pct += 10;
    return Math.max(0, Math.min(100, pct));
  }, [formAnswers]);

  // Load data & stats
  useEffect(() => {
    setPlans(loadPlans());
    const prefs: UserPrefs = loadPrefs();
    if (prefs.lang) setLang(prefs.lang as Lang);
    if (prefs.country) setCountry(prefs.country);
    if (prefs.favorites) setFavorites(prefs.favorites);

    const { uniqueCategories, totalVisits } = getWeeklyStats();
    setWeeklyUnique(uniqueCategories);
    setWeeklyTotal(totalVisits);

    // Listen to online/offline events
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Persist preferences
  useEffect(() => {
    savePrefs({ lang, country, favorites });
  }, [lang, country, favorites]);

  // Close modal with Escape
  useEffect(() => {
    if (!savedOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSavedOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [savedOpen]);

  const refreshWeeklyStats = () => {
    const { uniqueCategories, totalVisits } = getWeeklyStats();
    setWeeklyUnique(uniqueCategories);
    setWeeklyTotal(totalVisits);
  };

  const handleStart = (cat: string) => {
    setCategory(cat);
    trackVisit(cat);
    refreshWeeklyStats();
    setStep(1);
  };

  const handleBack = () => {
    if (step === 1) {
      setCategory(null);
      setFormAnswers({});
      setStep(0);
    } else if (step > 1) {
      setStep(step - 1);
    }
    refreshWeeklyStats();
  };

  const handleReset = () => {
    setCategory(null);
    setFormAnswers({});
    setStep(0);
    refreshWeeklyStats();
  };

  const handleSavePlan = (plan: {
    category: string;
    country: string;
    answers: Record<string, string>;
  }) => {
    try {
      const entry = savePlan(plan);
      setPlans((prev) => [entry, ...prev]);
      setSavedMsg("Plan saved locally ✔");
      setTimeout(() => setSavedMsg(""), 2500);
    } catch {
      setSavedMsg("Could not save. Check browser storage settings.");
      setTimeout(() => setSavedMsg(""), 3500);
    }
  };

  const handleLoadPlan = (p: SavedPlan) => {
    setCategory(p.category);
    setCountry(p.country);
    setFormAnswers(p.answers || {});
    setStep(2);
    setSavedOpen(false);
    trackVisit(p.category);
    refreshWeeklyStats();
  };

  const handleDeletePlan = (id: string) => {
    deletePlan(id);
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-white to-fuchsia-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="rounded-2xl border-2 border-purple-300 bg-white shadow-xl backdrop-blur p-8 md:p-10 space-y-8">
          <Header
            lang={lang}
            setLang={setLang}
            country={country}
            setCountry={setCountry}
            t={t}
          />

          {/* Offline Mode Banner */}
          {!isOnline && (
            <div className="rounded-xl border border-yellow-300 bg-yellow-50 text-yellow-800 px-4 py-2 text-sm">
              You are offline. Some features may be unavailable.
            </div>
          )}

          {/* Progress Summary */}
          <ProgressSummary
            weeklyUnique={weeklyUnique}
            weeklyTotal={weeklyTotal}
            planPercent={planPercent}
          />

          {/* Saved Plans Button */}
          <div className="flex justify-end -mt-2">
            <Button
              variant="outline"
              onClick={() => setSavedOpen(true)}
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              Saved Plans
            </Button>
          </div>

          {savedMsg && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
              {savedMsg}
            </div>
          )}

          <Stepper step={step} total={TOTAL_STEPS} />

          {step > 0 && (
            <div className="flex">
              <Button
                variant="outline"
                onClick={handleBack}
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                ← {t("back")}
              </Button>
            </div>
          )}

          {step === 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-800">{t("start")}</h2>
              <p className="text-sm text-muted-foreground">
                Pick the area you want help with today.
              </p>
              <CategorySelector
                setCategory={handleStart}
                favorites={favorites}
                setFavorites={setFavorites}
              />
            </div>
          )}

          {step === 1 && category && (
            <div className="space-y-6 mt-6">
              <QuestionForm
                t={t}
                onSubmit={(answers) => {
                  setFormAnswers(answers);
                  setStep(2);
                }}
              />
            </div>
          )}

          {step === 2 && category && (
            <div className="space-y-6">
              <ResultsView
                category={category}
                country={country}
                answers={formAnswers}
                lang={lang}
                onSave={handleSavePlan}
              />
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="border-purple-400 text-purple-700 hover:bg-purple-50"
                >
                  {t("start")}
                </Button>
              </div>
            </div>
          )}
        </div>

        <Footer lang={lang} />
      </div>

      {/* Saved Plans Modal */}
      {savedOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="saved-plans-title"
        >
          <button
            aria-label="Close"
            onClick={() => setSavedOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-purple-200 p-6 md:p-7 animate-fadeIn">
            <div id="saved-plans-title" className="sr-only">
              Saved Plans
            </div>
            <SavedPlans
              plans={plans}
              onDelete={handleDeletePlan}
              onLoad={handleLoadPlan}
              onClose={() => setSavedOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

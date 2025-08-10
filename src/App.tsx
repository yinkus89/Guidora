import { useState } from "react";
import Header from "./components/Header";
import Stepper from "./components/Stepper";
import CategorySelector from "./components/CategorySelector";
import ResultsView from "./components/ResultsView";
import QuestionForm from "./components/QuestionForm";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import type { Lang } from "./components/i18n";
import { I18N } from "./components/i18n";

export default function App() {
  const [lang, setLang] = useState<Lang>("en");
  const [country, setCountry] = useState("DE");
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<string | null>(null);
  const [formAnswers, setFormAnswers] = useState<Record<string, string>>({});

  const t = (key: string) => I18N[lang][key] || key;

  // Always 3 steps: Category → Questions → Results
  const TOTAL_STEPS = 3;

  const handleStart = (cat: string) => {
    setCategory(cat);
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
  };

  const handleReset = () => {
    setCategory(null);
    setFormAnswers({});
    setStep(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-white to-fuchsia-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Card container with color accents */}
        <div className="rounded-2xl border-2 border-purple-300 bg-white shadow-xl backdrop-blur p-8 md:p-10 space-y-8">

          <Header
            lang={lang}
            setLang={setLang}
            country={country}
            setCountry={setCountry}
            t={t}
          />

          <Stepper step={step} total={TOTAL_STEPS} />

          {/* Global Back (every step after 0) */}
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

          {/* Step 0: Category selection */}
          {step === 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-800">{t("start")}</h2>
              <p className="text-sm text-muted-foreground">
                Pick the area you want help with today.
              </p>
              <CategorySelector setCategory={handleStart} />
            </div>
          )}

          {/* Step 1: Personal questions (spaced lower) */}
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

          {/* Step 2: Results */}
          {step === 2 && category && (
            <div className="space-y-6">
              <ResultsView
                category={category}
                country={country}
                answers={formAnswers}
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

        {/* FOOTER */}
        <Footer lang={lang} />
      </div>
    </div>
  );
}

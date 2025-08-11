import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSuggestions } from "@/lib/suggestions";

interface QuestionFormProps {
  onSubmit: (answers: Record<string, string>) => void;
  onSuggest?: (keys: string[]) => void; // suggestion keys (not translated)
  t: (key: string) => string;
  category: string;
  country: string;
}

export default function QuestionForm({
  onSubmit,
  onSuggest,
  t,
  category,
  country,
}: QuestionFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({
    age: "",
    duration: "",
    contact: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (name: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };
  const markTouched = (name: string) =>
    setTouched((prev) => ({ ...prev, [name]: true }));

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (answers.age && (!/^\d+$/.test(answers.age) || Number(answers.age) <= 0)) {
      e.age = "Please enter a valid age.";
    }
    if (!answers.duration) e.duration = "This field is required.";
    if (!answers.contact) e.contact = "This field is required.";
    return e;
  }, [answers]);

  const isValid = Object.keys(errors).length === 0;

  // live suggestions
  useEffect(() => {
    if (!onSuggest) return;
    onSuggest(getSuggestions(category, country, answers));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers.age, answers.duration, answers.contact, category, country]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ age: true, duration: true, contact: true });
    if (!isValid) return;

    onSuggest?.(getSuggestions(category, country, answers));
    onSubmit(answers);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-10">
      {/* Age */}
      <div className="space-y-2">
        <Label htmlFor="age">
          {t("How old are you?")}{" "}
          <span className="text-gray-400">(optional)</span>
        </Label>
        <Input
          id="age"
          type="number"
          inputMode="numeric"
          placeholder="e.g. 28"
          value={answers.age}
          onChange={(e) => handleChange("age", e.target.value)}
          onBlur={() => markTouched("age")}
          className={
            touched.age && errors.age
              ? "border-red-400 focus-visible:ring-red-400"
              : ""
          }
        />
        {touched.age && errors.age && (
          <p className="text-xs text-red-600">{errors.age}</p>
        )}
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <Label>{t("How long have you been experiencing this difficulty?")}</Label>
        <Select
          value={answers.duration}
          onValueChange={(v) => handleChange("duration", v)}
        >
          <SelectTrigger
            className={
              touched.duration && errors.duration
                ? "border-red-400 focus:ring-red-400"
                : ""
            }
            onBlur={() => markTouched("duration")}
          >
            <SelectValue placeholder={`-- ${t("Select")} --`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="less_than_month">{t("Less than a month")}</SelectItem>
            <SelectItem value="1_6_months">{t("1–6 months")}</SelectItem>
            <SelectItem value="6_plus_months">{t("More than 6 months")}</SelectItem>
          </SelectContent>
        </Select>
        {touched.duration && errors.duration && (
          <p className="text-xs text-red-600">{errors.duration}</p>
        )}
      </div>

      {/* Contact */}
      <div className="space-y-2">
        <Label>{t("Would you like to be contacted by support services?")}</Label>
        <Select
          value={answers.contact}
          onValueChange={(v) => handleChange("contact", v)}
        >
          <SelectTrigger
            className={
              touched.contact && errors.contact
                ? "border-red-400 focus:ring-red-400"
                : ""
            }
            onBlur={() => markTouched("contact")}
          >
            <SelectValue placeholder={`-- ${t("Select")} --`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">{t("Yes")}</SelectItem>
            <SelectItem value="no">{t("No")}</SelectItem>
          </SelectContent>
        </Select>
        {touched.contact && errors.contact && (
          <p className="text-xs text-red-600">{errors.contact}</p>
        )}
      </div>

      {/* Submit */}
      <div className="pt-2">
        <Button type="submit" disabled={!isValid} className="w-full sm:w-auto">
          {t("next")}
        </Button>
        {!isValid && (
          <p className="mt-2 text-xs text-gray-500">
            Please complete the required fields to continue.
          </p>
        )}
      </div>
    </form>
  );
}

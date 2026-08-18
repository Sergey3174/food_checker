import { useState } from "react";
import { SelectionIndicator } from "./SelectionIndicator";

const languages = [
  { id: "ru", label: "Русский" },
  { id: "en", label: "English" },
];

export function LanguageSettings() {
  const [language, setLanguage] = useState("ru");

  return (
    <div className="border-t border-[var(--app-border)]/10 px-3.5 py-1.5">
      {languages.map(({ id, label }) => {
        const isSelected = language === id;
        return (
          <button
            aria-checked={isSelected}
            className="flex w-full items-center gap-3 py-2.5 text-left"
            key={id}
            onClick={() => setLanguage(id)}
            role="radio"
            type="button"
          >
            <SelectionIndicator selected={isSelected} />
            <span className="text-[11px] text-[var(--app-text-muted)]">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

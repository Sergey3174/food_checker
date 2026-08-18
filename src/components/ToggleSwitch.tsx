type ToggleSwitchProps = {
  checked: boolean;
  label: string;
  onCheckedChange: (checked: boolean) => void;
};

export function ToggleSwitch({ checked, label, onCheckedChange }: ToggleSwitchProps) {
  return (
    <button
      aria-checked={checked}
      aria-label={`${label}: ${checked ? "включено" : "выключено"}`}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
        checked ? "bg-[var(--app-success)]" : "bg-[var(--app-page)]"
      }`}
      onClick={() => onCheckedChange(!checked)}
      role="switch"
      type="button"
    >
      <span
        className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ transform: checked ? "translateX(16px)" : "translateX(0)" }}
      />
    </button>
  );
}

type SelectionIndicatorProps = {
  selected: boolean;
};

export function SelectionIndicator({ selected }: SelectionIndicatorProps) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-block h-5 w-5 shrink-0 rounded-full border bg-[var(--app-surface)] transition-colors ${
        selected
          ? "border-[var(--app-success)]"
          : "border-[var(--app-text-subtle)]"
      }`}
    >
      {selected && (
        <span className="absolute inset-0 m-auto h-2.5 w-2.5 rounded-full bg-[var(--app-success)]" />
      )}
    </span>
  );
}

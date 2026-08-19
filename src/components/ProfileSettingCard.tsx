import { ChevronDown, type LucideIcon } from "lucide-react";
import type { ComponentType, ReactNode } from "react";

type ProfileSettingCardProps = {
  content?: ComponentType;
  description: string;
  header: ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
};

type ProfileSettingCardHeaderProps = {
  icon: LucideIcon;
  label: string;
};

export function ProfileSettingCardHeader({
  icon: Icon,
  label,
}: ProfileSettingCardHeaderProps) {
  return (
    <>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--app-surface-raised)] text-[var(--app-success)]">
        <Icon size={18} />
      </span>
      <span className="flex-1 text-[13px] font-bold">{label}</span>
    </>
  );
}

export function ProfileSettingCard({
  content: Content,
  description,
  header,
  isExpanded,
  onToggle,
}: ProfileSettingCardProps) {
  return (
    <article className="shrink-0 overflow-hidden rounded-[16px] bg-[var(--app-surface)]">
      <button
        aria-expanded={isExpanded}
        className="flex w-full items-center gap-3 p-3.5 text-left"
        onClick={onToggle}
        type="button"
      >
        {header}
        <ChevronDown
          className={`text-[var(--app-text-subtle)] transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          size={18}
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          {Content ? (
            <Content />
          ) : (
            <p className="border-t border-[var(--app-border)]/10 px-3.5 py-3 pl-15 text-[11px] text-[var(--app-text-subtle)]">
              {description}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

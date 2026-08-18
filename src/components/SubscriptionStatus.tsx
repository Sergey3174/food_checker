import { BadgeCheck } from "lucide-react";
import { SelectionIndicator } from "./SelectionIndicator";

export function SubscriptionStatus() {
  return (
    <div className="border-t border-[var(--app-border)]/10 px-3.5 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[12px] font-bold text-[var(--app-text)]">
          <BadgeCheck className="text-[var(--app-success)]" size={18} />
          Нет активной подписки
        </div>
        <span aria-label="Подписка не активна" role="img">
          <SelectionIndicator selected={false} />
        </span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="max-w-[195px] text-[11px] leading-[18px] text-[var(--app-text-subtle)]">
          Оформите подписку, чтобы разблокировать все функции
        </p>
        <button className="max-w-[72px] text-right text-[11px] leading-[18px] font-semibold text-[var(--app-success)] underline underline-offset-2" type="button">
          Улучшить план
        </button>
      </div>
    </div>
  );
}

import { Mail, MessageCircleMore, Send } from "lucide-react";
import { useState } from "react";
import { SelectionIndicator } from "./SelectionIndicator";

const initialAccounts = [
  { id: "telegram", label: "Telegram", username: "@constmyname", icon: Send, isLinked: true },
  { id: "whatsapp", label: "WhatsApp", username: "", icon: MessageCircleMore, isLinked: false },
  { id: "email", label: "Почта", username: "sergey@email.com", icon: Mail, isLinked: true },
];

export function LinkedAccountsSettings() {
  const [accounts, setAccounts] = useState(initialAccounts);

  const linkAccount = (accountId: string) => {
    setAccounts((currentAccounts) =>
      currentAccounts.map((account) =>
        account.id === accountId
          ? { ...account, isLinked: true, username: "+7 999 123-45-67" }
          : account,
      ),
    );
  };

  return (
    <div className="border-t border-[var(--app-border)]/10 px-3.5 py-1.5">
      {accounts.map(({ id, label, username, icon: Icon, isLinked }) => (
        <div className="flex items-center gap-3 py-2.5" key={id}>
          <Icon className="text-[var(--app-text-subtle)]" size={16} />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-[var(--app-text-muted)]">{label}</p>
            {isLinked && <p className="truncate text-[10px] text-[var(--app-text-subtle)]">{username}</p>}
          </div>
          {isLinked ? (
            <span
              aria-label={`${label} привязан`}
              role="img"
            >
              <SelectionIndicator selected />
            </span>
          ) : (
            <button
              className="rounded-lg bg-[var(--app-surface-raised)] px-2.5 py-1.5 text-[10px] font-bold text-[var(--app-success)] transition-colors hover:bg-[var(--app-success)] hover:text-[var(--app-accent-text)]"
              onClick={() => linkAccount(id)}
              type="button"
            >
              Привязать
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

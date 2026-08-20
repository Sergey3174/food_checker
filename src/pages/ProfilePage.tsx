import {
  Bell,
  Copy,
  Globe2,
  KeyRound,
  Link2,
  LogOut,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { AuthButton } from "../components/AuthButton";
import { ChangePasswordForm } from "../components/ChangePasswordForm";
import { LanguageSettings } from "../components/LanguageSettings";
import { LinkedAccountsSettings } from "../components/LinkedAccountsSettings";
import { NotificationSettings } from "../components/NotificationSettings";
import {
  ProfileSettingCard,
  ProfileSettingCardHeader,
} from "../components/ProfileSettingCard";
import { SubscriptionStatus } from "../components/SubscriptionStatus";
import { useGetProfileQuery } from "../api/baseApi";

const settings = [
  {
    icon: Bell,
    label: "Уведомления",
    description: "Напоминания о приёмах пищи и прогрессе",
    content: NotificationSettings,
  },
  {
    icon: Globe2,
    label: "Язык",
    description: "Русский",
    content: LanguageSettings,
  },
  {
    icon: Link2,
    label: "Привязанные аккаунты",
    description: "Управляйте способами входа",
    content: LinkedAccountsSettings,
  },
  {
    icon: ShieldCheck,
    label: "Статус подписки",
    description: "Бесплатный план",
    content: SubscriptionStatus,
  },
  {
    icon: KeyRound,
    label: "Изменить пароль",
    description: "Обновите пароль от аккаунта",
    content: ChangePasswordForm,
  },
];

export function ProfilePage() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { data: profile } = useGetProfileQuery();
  const uid = profile?.identity ?? "—";
  const fullName = [profile?.first_name, profile?.last_name]
    .filter(Boolean)
    .join(" ") || "User";
  const telegramUsername = profile?.tg_username
    ? `@${profile.tg_username.replace(/^@/, "")}`
    : profile?.email ?? "";
  const avatarLetter = fullName.charAt(0).toUpperCase() || "U";

  const copyUid = async () => {
    await navigator.clipboard?.writeText(uid);
    setIsCopied(true);
    window.setTimeout(() => setIsCopied(false), 1600);
  };

  return (
    <div className="mx-auto flex h-[100dvh] w-full flex-col overflow-auto  pt-3">
      <header className="px-4 flex items-center justify-between">
        <div>
          {/* <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--app-text-subtle)]">
            Настройки
          </p> */}
          <h1 className="mt-0.5 text-[24px] font-extrabold tracking-tight">
            Профиль
          </h1>
        </div>
        {/* <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--app-surface)] text-[var(--app-success)]">
          <Crown size={20} />
        </div> */}
      </header>

      {/* <section className="mt-5 rounded-[18px] border border-[var(--app-success)]/20 bg-[var(--app-surface-raised)] p-3.5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--app-success)] text-[var(--app-accent-text)]">
            <Crown size={19} />
          </span>
          <p className="min-w-0 flex-1 text-[12px] leading-[18px] text-[var(--app-text-muted)]">
            Подписка не активна. Откройте все возможности Food.
          </p>
          <button className="shrink-0 rounded-xl bg-[var(--app-success)] px-3 py-2 text-[11px] font-extrabold text-[var(--app-accent-text)]" type="button">
            Выбрать план
          </button>
        </div>
      </section> */}

      <section className="mt-5 px-4  flex items-center gap-3  border-b border-[var(--app-border)]/15 pb-5">
        <div className="grid  h-18 w-18 shrink-0 place-items-center rounded-full border-3 border-[var(--app-success)]  text-[24px] font-extrabold text-white">
          {avatarLetter}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-[17px] font-extrabold">{fullName}</h2>
          <p className="mt-0.5 text-[12px] text-[var(--app-text-subtle)]">
            {telegramUsername}
          </p>
          <button
            className="mt-1 flex items-center gap-1.5 text-[10px] text-[var(--app-text-muted)] transition-colors hover:text-[var(--app-success)]"
            onClick={copyUid}
            type="button"
          >
            UID: {uid}
            <Copy size={12} />
            {isCopied && (
              <span className="text-[var(--app-success)]">Скопировано</span>
            )}
          </button>
        </div>
      </section>

      <section
        aria-label="Настройки профиля"
        className="pt-5  pb-[78px] px-4 flex flex-1 flex-col gap-2.5 overflow-auto"
      >
        {settings.map(({ icon, label, description, content }) => {
          const isExpanded = expandedItem === label;

          return (
            <ProfileSettingCard
              content={content}
              description={description}
              header={<ProfileSettingCardHeader icon={icon} label={label} />}
              isExpanded={isExpanded}
              key={label}
              onToggle={() => setExpandedItem(isExpanded ? null : label)}
            />
          );
        })}
        <section className="mt-auto pt-5 flex flex-col gap-2 pb-3">
          <AuthButton className="h-11 rounded-[14px] hover:bg-[var(--app-success)]">
            <LogOut size={17} />
            Выйти из аккаунта
          </AuthButton>
          <AuthButton className="h-11 rounded-[14px] hover:bg-[var(--app-success)]">
            <Trash2 size={17} />
            Удалить аккаунт
          </AuthButton>
        </section>
      </section>
    </div>
  );
}

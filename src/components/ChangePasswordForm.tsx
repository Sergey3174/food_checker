import { useState } from "react";
import { AuthButton } from "./AuthButton";
import { AuthInput } from "./AuthInput";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const savePassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentPassword || !newPassword) return;
    setIsSaved(true);
  };

  return (
    <form className="border-t border-[var(--app-border)]/10 px-3.5 py-3" onSubmit={savePassword}>
      <div className="flex flex-col gap-2">
        <AuthInput
          autoComplete="current-password"
          label="Текущий пароль"
          onChange={(event) => setCurrentPassword(event.target.value)}
          placeholder="Текущий пароль"
          type="password"
          value={currentPassword}
        />
        <AuthInput
          autoComplete="new-password"
          label="Новый пароль"
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder="Новый пароль"
          type="password"
          value={newPassword}
        />
      </div>
      <AuthButton className="mt-3 h-10" disabled={!currentPassword || !newPassword} type="submit">
        Сохранить
      </AuthButton>
      {isSaved && <p className="mt-2 text-center text-[10px] text-[var(--app-success)]">Пароль сохранён</p>}
    </form>
  );
}

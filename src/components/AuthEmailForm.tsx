import type { FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { AuthButton } from "./AuthButton";
import { AuthInput } from "./AuthInput";

type AuthEmailFormProps = {
  onBack: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function AuthEmailForm({ onBack, onSubmit }: AuthEmailFormProps) {
  return (
    <form className="relative space-y-2.5" onSubmit={onSubmit}>
      <AuthButton
        className="absolute -top-9 left-0"
        variant="icon"
        onClick={onBack}
        aria-label="Назад к способам входа"
      >
        <ArrowLeft size={19} aria-hidden="true" />
      </AuthButton>
      <AuthInput
        label="Email"
        id="email"
        name="email"
        type="email"
        placeholder="Email"
        required
        autoComplete="email"
      />
      <AuthInput
        label="Пароль"
        id="password"
        name="password"
        type="password"
        placeholder="Пароль"
        required
        autoComplete="current-password"
      />
      <AuthButton type="submit">Login</AuthButton>
    </form>
  );
}

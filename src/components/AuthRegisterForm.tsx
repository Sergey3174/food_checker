import type { FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { AuthButton } from "./AuthButton";
import { AuthInput } from "./AuthInput";

type AuthRegisterFormProps = {
  onBack: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function AuthRegisterForm({ onBack, onSubmit }: AuthRegisterFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const password = form.elements.namedItem("password") as HTMLInputElement;
    const confirmPassword = form.elements.namedItem(
      "confirmPassword",
    ) as HTMLInputElement;

    if (password.value !== confirmPassword.value) {
      event.preventDefault();
      confirmPassword.setCustomValidity("Passwords do not match");
      confirmPassword.reportValidity();
      return;
    }

    confirmPassword.setCustomValidity("");
    onSubmit(event);
  }

  return (
    <form className="relative space-y-2.5" onSubmit={handleSubmit}>
      <AuthButton
        className="absolute -top-9 left-0"
        variant="icon"
        onClick={onBack}
        aria-label="Back to sign in"
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
        label="Password"
        id="password"
        name="password"
        type="password"
        placeholder="Password"
        required
        autoComplete="new-password"
      />
      <AuthInput
        label="Repeat password"
        id="confirm-password"
        name="confirmPassword"
        type="password"
        placeholder="Repeat password"
        required
        autoComplete="new-password"
      />
      <AuthButton type="submit">Create account</AuthButton>
    </form>
  );
}

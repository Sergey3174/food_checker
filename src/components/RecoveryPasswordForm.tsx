import { useState, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { AuthButton } from "./AuthButton";
import { AuthInput } from "./AuthInput";

type RecoveryPasswordFormProps = {
  errorMessage?: string | null;
  isLoading?: boolean;
  onBack: () => void;
  onSubmit: (password: string) => void;
};

export function RecoveryPasswordForm({
  errorMessage,
  isLoading = false,
  onBack,
  onSubmit,
}: RecoveryPasswordFormProps) {
  const [validationError, setValidationError] = useState<string | null>(null);

  function handleInput() {
    setValidationError(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const password = form.elements.namedItem("password") as HTMLInputElement;
    const confirmPassword = form.elements.namedItem(
      "confirmPassword",
    ) as HTMLInputElement;

    if (!password.value || !confirmPassword.value) {
      setValidationError("Fill in both password fields");
      return;
    }

    if (password.value !== confirmPassword.value) {
      setValidationError("Passwords do not match");
      return;
    }

    setValidationError(null);
    onSubmit(password.value);
  }

  return (
    <form className="relative space-y-2.5" noValidate onSubmit={handleSubmit}>
      <AuthButton
        className="absolute -top-9 left-0"
        variant="icon"
        onClick={onBack}
        aria-label="Back to verification"
      >
        <ArrowLeft size={19} aria-hidden="true" />
      </AuthButton>
      <AuthInput
        label="New password"
        id="password"
        name="password"
        type="password"
        placeholder="New password"
        required
        autoComplete="new-password"
        onInput={handleInput}
      />
      <AuthInput
        label="Repeat password"
        id="confirm-password"
        name="confirmPassword"
        type="password"
        placeholder="Repeat password"
        required
        autoComplete="new-password"
        onInput={handleInput}
      />
      {(validationError ?? errorMessage) && (
        <p className="text-center text-[11px] text-red-300">
          {validationError ?? errorMessage}
        </p>
      )}
      <AuthButton disabled={isLoading} type="submit">
        {isLoading ? "Saving password..." : "Save password"}
      </AuthButton>
    </form>
  );
}

import { useState, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { getApiErrorMessage, useConfirmLoginMutation } from "../api/baseApi";
import type { RegistrationCredentials } from "../store/authSlice";
import { AuthButton } from "./AuthButton";
import { AuthInput } from "./AuthInput";

type AuthRegisterFormProps = {
  onBack: () => void;
  onSuccess: (credentials: RegistrationCredentials) => void;
};

export function AuthRegisterForm({ onBack, onSuccess }: AuthRegisterFormProps) {
  const [confirmLogin, { error, isLoading, reset }] = useConfirmLoginMutation();
  const [validationError, setValidationError] = useState<string | null>(null);
  const errorMessage = getApiErrorMessage(error);

  function handleInput(event: FormEvent<HTMLInputElement>) {
    const form = event.currentTarget.form;
    if (!form) return;

    const confirmPassword = form.elements.namedItem(
      "confirmPassword",
    ) as HTMLInputElement;

    confirmPassword.setCustomValidity("");
    setValidationError(null);
    reset();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const password = form.elements.namedItem("password") as HTMLInputElement;
    const confirmPassword = form.elements.namedItem(
      "confirmPassword",
    ) as HTMLInputElement;
    const passwordsDoNotMatch =
      Boolean(confirmPassword.value) && password.value !== confirmPassword.value;

    confirmPassword.setCustomValidity(
      passwordsDoNotMatch ? "Passwords do not match" : "",
    );

    const firstInvalidInput = Array.from(form.elements).find(
      (element): element is HTMLInputElement =>
        element instanceof HTMLInputElement && !element.validity.valid,
    );

    if (firstInvalidInput) {
      setValidationError(
        firstInvalidInput.name === "confirmPassword" &&
          passwordsDoNotMatch
          ? "Passwords do not match"
          : firstInvalidInput.validationMessage,
      );
      firstInvalidInput.focus();
      return;
    }

    confirmPassword.setCustomValidity("");
    setValidationError(null);
    const login = String(new FormData(form).get("email") ?? "");

    try {
      await confirmLogin({
        login,
        recovery: false,
      }).unwrap();
      onSuccess({ login, password: password.value });
    } catch {
      // RTK Query stores the request error in `error` for the form message.
    }
  }

  return (
    <form className="relative space-y-2.5" noValidate onSubmit={handleSubmit}>
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
        onInput={handleInput}
      />
      <AuthInput
        label="Password"
        id="password"
        name="password"
        type="password"
        placeholder="Password"
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
        {isLoading ? "Отправляем код..." : "Создать аккаунт"}
      </AuthButton>
    </form>
  );
}

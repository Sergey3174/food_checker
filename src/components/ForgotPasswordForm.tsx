import type { FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { getApiErrorMessage, useConfirmLoginMutation } from "../api/baseApi";
import { AuthButton } from "./AuthButton";
import { AuthInput } from "./AuthInput";

type ForgotPasswordFormProps = {
  onBack: () => void;
  onSuccess: (login: string) => void;
};

export function ForgotPasswordForm({
  onBack,
  onSuccess,
}: ForgotPasswordFormProps) {
  const [confirmLogin, { error, isLoading, reset }] = useConfirmLoginMutation();
  const errorMessage = getApiErrorMessage(error);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const login = String(new FormData(event.currentTarget).get("email") ?? "");

    try {
      await confirmLogin({ login, recovery: true }).unwrap();
      onSuccess(login);
    } catch {
      // RTK Query stores the request error in `error` for the form message.
    }
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
        onInput={reset}
      />
      {errorMessage && (
        <p className="text-center text-[11px] text-red-300">{errorMessage}</p>
      )}
      <AuthButton disabled={isLoading} type="submit">
        {isLoading ? "Sending code..." : "Send code"}
      </AuthButton>
    </form>
  );
}

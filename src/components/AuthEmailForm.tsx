import type { FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { useDispatch } from "react-redux";
import { getApiErrorMessage, useAuthenticateMutation } from "../api/baseApi";
import { persistAuth, setIsAuthenticated } from "../store/authSlice";
import { AuthButton } from "./AuthButton";
import { AuthInput } from "./AuthInput";
import { useNavigate } from "react-router-dom";

type AuthEmailFormProps = {
  onBack: () => void;
  onSuccess: () => void;
};

export function AuthEmailForm({ onBack, onSuccess }: AuthEmailFormProps) {
  const [authenticate, { error, isLoading }] = useAuthenticateMutation();
  const dispatch = useDispatch();
  const errorMessage = getApiErrorMessage(error);

  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    try {
      const result = await authenticate({
        login: String(formData.get("login") ?? ""),
        password: String(formData.get("password") ?? ""),
      }).unwrap();
      persistAuth(result.authorization);
      dispatch(setIsAuthenticated(Boolean(result.authorization)));
      onSuccess();
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
        aria-label="Назад к способам входа"
      >
        <ArrowLeft size={19} aria-hidden="true" />
      </AuthButton>
      <AuthInput
        label="Email"
        id="email"
        name="login"
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
      <div className="flex">
        <AuthButton
          className=""
          variant="text"
          onClick={() => navigate("/forgot-password")}
        >
          Забыли пароль?
        </AuthButton>
      </div>
      {errorMessage && (
        <p className="text-center text-[11px] text-red-300">{errorMessage}</p>
      )}
      <AuthButton disabled={isLoading} type="submit">
        {isLoading ? "Входим..." : "Войти"}
      </AuthButton>
    </form>
  );
}

import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthButton } from "../components/AuthButton";
import { AuthEmailForm } from "../components/AuthEmailForm";
import { AuthLayout } from "../layouts/AuthLayout";

export function AuthPage() {
  const [isEmailFormOpen, setIsEmailFormOpen] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate("/home");
  }

  return (
    <AuthLayout
      title="Food"
      description="Connect with nature and plan your next green escape with Food."
    >
      <div
        key={isEmailFormOpen ? "email-form" : "sign-in-options"}
        className="animate-auth-actions-in motion-reduce:animate-none"
      >
        {isEmailFormOpen ? (
          <AuthEmailForm
            onBack={() => setIsEmailFormOpen(false)}
            onSubmit={handleSubmit}
          />
        ) : (
          <>
            <AuthButton onClick={() => navigate("/home")}>
              Continue with Telegram
            </AuthButton>
            <AuthButton
              className="mt-2.5"
              variant="secondary"
              onClick={() => setIsEmailFormOpen(true)}
            >
              Continue with Email
            </AuthButton>
          </>
        )}
        <AuthButton
          className="mt-[17px]"
          variant="text"
          onClick={() => navigate("/reg")}
        >
          Create account
        </AuthButton>
      </div>
    </AuthLayout>
  );
}

import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthRegisterForm } from "../components/AuthRegisterForm";
import { AuthLayout } from "../layouts/AuthLayout";

export function RegisterPage() {
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate("/otp");
  }

  return (
    <AuthLayout
      title="Food"
      description="Create your Food account and start planning your next meal."
    >
      <AuthRegisterForm
        onBack={() => navigate("/auth")}
        onSubmit={handleSubmit}
      />
    </AuthLayout>
  );
}

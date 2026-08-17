import { useNavigate } from "react-router-dom";
import { AuthOtpForm } from "../components/AuthOtpForm";
import { AuthLayout } from "../layouts/AuthLayout";

export function OtpPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      title="Verify email"
      description="Enter the 6-digit code we sent to your email."
    >
      <AuthOtpForm onBack={() => navigate("/reg")} onSubmit={() => navigate("/home")} />
    </AuthLayout>
  );
}

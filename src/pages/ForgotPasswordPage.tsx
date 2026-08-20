import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";
import { AuthLayout } from "../layouts/AuthLayout";
import { setRecoveryLogin } from "../store/authSlice";

export function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <AuthLayout
      title="Reset password"
      description="Enter your email and we will send you a verification code."
    >
      <ForgotPasswordForm
        onBack={() => navigate("/auth")}
        onSuccess={(login) => {
          dispatch(setRecoveryLogin(login));
          navigate("/otp?flow=forgot-password");
        }}
      />
    </AuthLayout>
  );
}

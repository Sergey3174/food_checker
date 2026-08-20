import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AuthRegisterForm } from "../components/AuthRegisterForm";
import { AuthLayout } from "../layouts/AuthLayout";
import {
  setRegistrationCredentials,
  type RegistrationCredentials,
} from "../store/authSlice";

export function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <AuthLayout
      title="Food"
      description="Create your Food account and start planning your next meal."
    >
      <AuthRegisterForm
        onBack={() => navigate("/auth")}
        onSuccess={(credentials: RegistrationCredentials) => {
          dispatch(setRegistrationCredentials(credentials));
          navigate("/otp");
        }}
      />
    </AuthLayout>
  );
}

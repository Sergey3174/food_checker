import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getApiErrorMessage,
  useRecoverPasswordMutation,
} from "../api/baseApi";
import { RecoveryPasswordForm } from "../components/RecoveryPasswordForm";
import { AuthLayout } from "../layouts/AuthLayout";
import type { RootState } from "../store/store";
import {
  clearRecoveryCredentials,
} from "../store/authSlice";

export function RecoveryPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const recoveryCredentials = useSelector(
    (state: RootState) => state.auth.recoveryCredentials,
  );
  const [recoverPassword, { error, isLoading }] = useRecoverPasswordMutation();

  async function handleSubmit(password: string) {
    if (!recoveryCredentials?.hash) return;

    try {
      await recoverPassword({
        hash: recoveryCredentials.hash,
        login: recoveryCredentials.login,
        password,
      }).unwrap();
      dispatch(clearRecoveryCredentials());
      navigate("/auth");
    } catch {
      // RTK Query stores the request error in `error` for the form message.
    }
  }

  return (
    <AuthLayout
      title="Create a new password"
      description="Choose a new password for your account."
    >
      <RecoveryPasswordForm
        errorMessage={getApiErrorMessage(error)}
        isLoading={isLoading}
        onBack={() => navigate("/otp?flow=forgot-password")}
        onSubmit={handleSubmit}
      />
    </AuthLayout>
  );
}

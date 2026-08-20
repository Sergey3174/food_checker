import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getApiErrorMessage,
  useAuthenticateMutation,
  useConfirmLoginMutation,
  useCreateUserMutation,
} from "../api/baseApi";
import { AuthOtpForm } from "../components/AuthOtpForm";
import { AuthLayout } from "../layouts/AuthLayout";
import type { RootState } from "../store/store";
import {
  clearRegistrationCredentials,
  persistAuth,
  setIsAuthenticated,
  setRecoveryHash,
} from "../store/authSlice";

export function OtpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [confirmLogin, { error, isLoading }] = useConfirmLoginMutation();
  const [authenticate, { error: authenticateError, isLoading: isAuthenticating }] =
    useAuthenticateMutation();
  const [createUser, { error: createUserError, isLoading: isCreatingUser }] =
    useCreateUserMutation();
  const registrationCredentials = useSelector(
    (state: RootState) => state.auth.registrationCredentials,
  );
  const recoveryCredentials = useSelector(
    (state: RootState) => state.auth.recoveryCredentials,
  );
  const isForgotPasswordFlow =
    searchParams.get("flow") === "forgot-password";
  const errorMessage = getApiErrorMessage(
    error ?? createUserError ?? authenticateError,
  );

  async function handleSubmit(code: string) {
    if (isForgotPasswordFlow) {
      if (!recoveryCredentials) return;

      try {
        const confirmation = await confirmLogin({
          code,
          login: recoveryCredentials.login,
          recovery: true,
        }).unwrap();
        dispatch(setRecoveryHash(confirmation.data.hash));
        navigate("/recovery-password");
      } catch {
        // RTK Query stores the request error in `error` for the form message.
      }
      return;
    }

    if (!registrationCredentials) return;

    try {
      const confirmation = await confirmLogin({
        code,
        login: registrationCredentials.login,
        recovery: false,
      }).unwrap();
      await createUser({
        hash: confirmation.data.hash,
        login: registrationCredentials.login,
        password: registrationCredentials.password,
      }).unwrap();
      const authenticatedUser = await authenticate({
        login: registrationCredentials.login,
        password: registrationCredentials.password,
      }).unwrap();
      persistAuth(authenticatedUser.authorization);
      dispatch(clearRegistrationCredentials());
      dispatch(setIsAuthenticated(Boolean(authenticatedUser.authorization)));
      navigate("/home");
    } catch {
      // RTK Query stores the request error in `error` for the form message.
    }
  }

  return (
    <AuthLayout
      title="Verify email"
      description={
        isForgotPasswordFlow && recoveryCredentials
          ? `Enter the verification code sent to ${recoveryCredentials.login}.`
          : registrationCredentials
          ? `Введите 6-значный код, отправленный на ${registrationCredentials.login}.`
          : "Введите 6-значный код, отправленный на вашу почту."
      }
    >
      <AuthOtpForm
        errorMessage={errorMessage}
        isLoading={
          isLoading ||
          (!isForgotPasswordFlow && (isCreatingUser || isAuthenticating))
        }
        onBack={() =>
          navigate(isForgotPasswordFlow ? "/forgot-password" : "/reg")
        }
        onSubmit={handleSubmit}
      />
    </AuthLayout>
  );
}

import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { HomeLayout } from "../layouts/HomeLayout";
// import { HomePage } from "../pages/HomePage";
// import { WelcomePage } from "../pages/WelcomePage";
import { AuthPage } from "../pages/AuthPage";
import { RegisterPage } from "../pages/RegisterPage";
import { OtpPage } from "../pages/OtpPage";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";
import { RecoveryPasswordPage } from "../pages/RecoveryPasswordPage";
import { HomePage } from "../pages/HomePage";
import { ChatPage } from "../pages/ChatPage";
import { ScanPage } from "../pages/ScanPage";
import { ProfilePage } from "../pages/ProfilePage";
import { RequireAuth, RequireGuest } from "./AuthGuards";
// import { OtpPage } from "../pages/OtpPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/auth" replace />,
      },
      // {
      //   path: "welcome",
      //   element: <WelcomePage />,
      // },
      {
        element: <RequireAuth />,
        children: [
          {
            element: <HomeLayout />,
            children: [
              {
                path: "home",
                element: <HomePage />,
              },
              {
                path: "profile",
                element: <ProfilePage />,
              },
            ],
          },
          {
            path: "chat",
            element: <ChatPage />,
          },
          {
            path: "scan",
            element: <ScanPage />,
          },
        ],
      },
      {
        element: <RequireGuest />,
        children: [
          {
            path: "auth",
            element: <AuthPage />,
          },
          {
            path: "reg",
            element: <RegisterPage />,
          },
          {
            path: "otp",
            element: <OtpPage />,
          },
          {
            path: "forgot-password",
            element: <ForgotPasswordPage />,
          },
          {
            path: "recovery-password",
            element: <RecoveryPasswordPage />,
          },
        ],
      },
    ],
  },
]);

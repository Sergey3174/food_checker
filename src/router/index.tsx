import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { HomeLayout } from "../layouts/HomeLayout";
// import { HomePage } from "../pages/HomePage";
// import { WelcomePage } from "../pages/WelcomePage";
import { AuthPage } from "../pages/AuthPage";
import { RegisterPage } from "../pages/RegisterPage";
import { OtpPage } from "../pages/OtpPage";
import { HomePage } from "../pages/HomePage";
import { ChatPage } from "../pages/ChatPage";
import { ScanPage } from "../pages/ScanPage";
import { ProfilePage } from "../pages/ProfilePage";
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
    ],
  },
]);

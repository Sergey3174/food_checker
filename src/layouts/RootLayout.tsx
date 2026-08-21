import { Outlet } from "react-router-dom";
import "@khmyznikov/pwa-install";

export function RootLayout() {
  return (
    <>
      <pwa-install
        use-local-storage
        // install-description="Custom call to install text"
        disable-screenshots
        disable-screenshots-apple
        disable-screenshots-chrome
        disable-android-fallback
        name="Food detector"
        description="Food detector"
        icon="/icon.png"
      ></pwa-install>
      <Outlet />
    </>
  );
}

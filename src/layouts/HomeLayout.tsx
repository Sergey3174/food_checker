import { Outlet } from "react-router-dom";
import { HomeNavigation } from "../components/HomeNavigation";

export function HomeLayout() {
  return (
    <main className="app-theme min-h-svh overflow-hidden bg-[var(--app-page)] font-[Manrope,sans-serif] text-[var(--app-text)]">
      <Outlet />
      <HomeNavigation />
    </main>
  );
}

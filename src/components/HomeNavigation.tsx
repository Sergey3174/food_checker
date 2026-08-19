import { Check, Home, MessageCircle, ScanLine, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";

const navigationItemClassName = (isActive: boolean) =>
  `flex flex-col items-center gap-1 w-10 transition-colors ${
    isActive
      ? "font-bold text-[var(--app-success)]"
      : "text-[var(--app-text-subtle)]"
  }`;

const iconFill = (isActive: boolean) => (isActive ? "currentColor" : "none");

export function HomeNavigation() {
  return (
    <nav
      aria-label="Основная навигация"
      className="fixed right-0 bottom-0 left-0 z-10 mx-auto flex h-[64px] items-center justify-around bg-[var(--app-surface)] px-3"
    >
      <NavLink
        className={({ isActive }) => navigationItemClassName(isActive)}
        to="/home"
      >
        {({ isActive }) => (
          <>
            <Home fill={iconFill(isActive)} size={19} />
            <span className="text-[8px]">Главная</span>
          </>
        )}
      </NavLink>
      <NavLink
        className={({ isActive }) => navigationItemClassName(isActive)}
        to="/chat"
      >
        {({ isActive }) => (
          <>
            <MessageCircle fill={iconFill(isActive)} size={19} />
            <span className="text-[8px]">Ассистент</span>
          </>
        )}
      </NavLink>
      <NavLink
        aria-label="Сканировать блюдо"
        className="-mt-6 grid h-14 w-14 place-items-center rounded-full bg-[var(--app-success)] text-[var(--app-accent-text)] shadow-[0_5px_20px_rgba(156,184,255,.35)]"
        to="/scan"
      >
        {({ isActive }) => <ScanLine fill={iconFill(isActive)} size={27} />}
      </NavLink>
      <button className={navigationItemClassName(false)} type="button">
        <Check size={19} />
        <span className="text-[8px]">Планы</span>
      </button>
      <NavLink
        className={({ isActive }) => navigationItemClassName(isActive)}
        to="/profile"
      >
        {({ isActive }) => (
          <>
            <UserRound fill={iconFill(isActive)} size={19} />
            <span className="text-[8px]">Профиль</span>
          </>
        )}
      </NavLink>
    </nav>
  );
}

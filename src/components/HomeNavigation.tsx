import { Check, Home, MessageCircle, ScanLine, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HomeNavigation() {
  const navigate = useNavigate();

  return (
    <nav
      aria-label="Основная навигация"
      className="fixed right-0 bottom-0 left-0 z-10 mx-auto flex h-[64px] items-center justify-around bg-[var(--app-surface)] px-3"
    >
      <button className="flex flex-col items-center gap-1 text-[var(--app-success)]" type="button">
        <Home fill="currentColor" size={19} />
        <span className="text-[8px] font-bold">Главная</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-[var(--app-text-subtle)]" onClick={() => navigate("/chat")} type="button">
        <MessageCircle size={19} />
        <span className="text-[8px]">Ассистент</span>
      </button>
      <button
        aria-label="Сканировать блюдо"
        className="-mt-6 grid h-14 w-14 place-items-center rounded-full bg-[var(--app-success)] text-[var(--app-accent-text)] shadow-[0_5px_20px_rgba(156,184,255,.35)]"
        onClick={() => navigate("/scan")}
        type="button"
      >
        <ScanLine size={27} />
      </button>
      <button className="flex flex-col items-center gap-1 text-[var(--app-text-subtle)]" type="button">
        <Check size={19} />
        <span className="text-[8px]">Планы</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-[var(--app-text-subtle)]" type="button">
        <UserRound size={19} />
        <span className="text-[8px]">Профиль</span>
      </button>
    </nav>
  );
}

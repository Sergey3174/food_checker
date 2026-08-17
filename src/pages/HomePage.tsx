import { MessageCircle, ScanLine } from "lucide-react";
import { AuthLayout } from "../layouts/AuthLayout";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const navigate = useNavigate();
  return (
    <AuthLayout
      eyebrow="Главная"
      title="Food"
      description="Выберите действие, чтобы продолжить."
    >
      <nav aria-label="Главное меню" className="w-full space-y-2">
        <button
          className="group flex min-h-[76px] w-full items-center gap-4 rounded-[21px] bg-[var(--auth-primary)] px-5 text-left text-[var(--auth-primary-text)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
          type="button"
          onClick={() => navigate("/scan")}
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--auth-primary-text)] text-[var(--auth-primary)]">
            <ScanLine aria-hidden="true" size={23} strokeWidth={2.2} />
          </span>
          <span className="flex-1 text-[15px] font-bold">Сканер</span>
          <span
            aria-hidden="true"
            className="text-xl transition-transform group-hover:translate-x-0.5"
          >
            ›
          </span>
        </button>
        <button
          className="group flex min-h-[76px] w-full items-center gap-4 rounded-[21px] bg-[var(--auth-primary)] px-5 text-left text-[var(--auth-primary-text)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
          type="button"
          onClick={() => navigate("/chat")}
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--auth-primary-text)] text-[var(--auth-primary)]">
            <MessageCircle aria-hidden="true" size={23} strokeWidth={2.2} />
          </span>
          <span className="flex-1 text-[15px] font-bold">Chat</span>
          <span
            aria-hidden="true"
            className="text-xl transition-transform group-hover:translate-x-0.5"
          >
            ›
          </span>
        </button>
      </nav>
    </AuthLayout>
  );
}

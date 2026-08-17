import type { ReactNode } from "react";
import backgroundImage from "../assets/images/bg-sugar3.png";

type AuthLayoutProps = {
  children: ReactNode;
  description: string;
  eyebrow?: string;
  title: string;
};

export function AuthLayout({
  children,
  description,
  eyebrow = "Welcome to",
  title,
}: AuthLayoutProps) {
  return (
    <main
      className="auth-theme grid min-h-svh place-items-center overflow-hidden bg-cover bg-center text-[var(--auth-text)]"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <section
        className="relative flex min-h-svh w-full isolate flex-col overflow-hidden"
        aria-labelledby="auth-title"
      >
        <div className="relative z-20 px-8 pt-20 text-center">
          <p className="text-[16px] font-medium tracking-wide">{eyebrow}</p>
          <h1
            id="auth-title"
            className="text-[44px] font-bold  leading-none tracking-wide"
          >
            {title}
          </h1>
          <p className="mx-auto mt-2  text-[11px] text-[var(--auth-muted)]">
            {description}
          </p>
        </div>
        <div className="relative z-20 mt-auto animate-auth-actions-in bg-[linear-gradient(180deg,transparent,var(--auth-card)_25%)] px-[23px] pt-24 pb-[29px] text-center motion-reduce:animate-none">
          {children}
        </div>
      </section>
    </main>
  );
}

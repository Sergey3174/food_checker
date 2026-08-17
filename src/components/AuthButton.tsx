import type { ButtonHTMLAttributes, ReactNode } from "react";

type AuthButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "text" | "icon";
};

const variantClasses = {
  primary:
    "flex h-[47px] w-full items-center justify-center rounded-[12px] bg-[var(--auth-primary)] text-[12px] font-bold text-[var(--auth-primary-text)] transition-transform hover:-translate-y-0.5",
  secondary:
    "flex h-[47px] w-full items-center justify-center rounded-[12px] border-2 border-[var(--auth-outline)] text-[12px] font-bold text-[var(--auth-text)] transition-transform hover:-translate-y-0.5",
  text: "inline-block text-[11px] text-[var(--auth-muted)]",
  icon: "inline-flex h-7 w-7 items-center justify-center rounded-full text-[var(--auth-muted)] transition-colors hover:bg-white/10 hover:text-white",
};

export function AuthButton({
  children,
  className = "",
  type = "button",
  variant = "primary",
  ...props
}: AuthButtonProps) {
  return (
    <button
      className={`${variantClasses[variant]} focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

import type { InputHTMLAttributes } from "react";

type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & { label: string };

export function AuthInput({ label, className = "", ...props }: AuthInputProps) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <input
        className={`h-[47px] w-full rounded-[12px] border border-[var(--auth-outline)] bg-white/10 px-5 text-[13px] text-white outline-none placeholder:text-[var(--auth-muted)] focus:border-white ${className}`}
        {...props}
      />
    </label>
  );
}

import { useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { AuthButton } from "./AuthButton";

type AuthOtpFormProps = {
  onBack: () => void;
  onSubmit: (code: string) => void;
};

const OTP_LENGTH = 6;

export function AuthOtpForm({ onBack, onSubmit }: AuthOtpFormProps) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  function updateDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = digit;
    setDigits(nextDigits);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = digits.join("");

    if (code.length !== OTP_LENGTH) {
      inputRefs.current[digits.findIndex((digit) => !digit)]?.focus();
      return;
    }

    onSubmit(code);
  }

  return (
    <form className="relative" onSubmit={handleSubmit}>
      <AuthButton className="absolute -top-9 left-0" variant="icon" onClick={onBack} aria-label="Back to registration">
        <ArrowLeft size={19} aria-hidden="true" />
      </AuthButton>
      <div className="flex justify-center gap-2.5" aria-label="Verification code">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => { inputRefs.current[index] = element; }}
            className="h-12 w-10 rounded-xl border border-[var(--auth-outline)] bg-white/10 text-center text-lg font-bold text-white outline-none focus:border-white"
            aria-label={`Digit ${index + 1}`}
            inputMode="numeric"
            maxLength={1}
            pattern="[0-9]*"
            value={digit}
            onChange={(event) => updateDigit(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
          />
        ))}
      </div>
      <AuthButton className="mt-5" type="submit">Verify code</AuthButton>
    </form>
  );
}

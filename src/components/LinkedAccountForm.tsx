import { useEffect, useState } from "react";
import { AuthButton } from "./AuthButton";
import { AuthInput } from "./AuthInput";

export type LinkedAccountType = "telegram" | "whatsapp" | "email";

type LinkedAccountFormProps = {
  accountType: LinkedAccountType;
  onSubmit: (value: string) => void;
};

const fields = {
  telegram: {
    autoComplete: "username",
    label: "Telegram",
    placeholder: "@username",
    submitLabel: "Привязать Telegram",
    type: "text",
  },
  whatsapp: {
    autoComplete: "tel",
    label: "WhatsApp",
    placeholder: "+7 999 123-45-67",
    submitLabel: "Привязать WhatsApp",
    type: "tel",
  },
  email: {
    autoComplete: "email",
    label: "Email",
    placeholder: "name@example.com",
    submitLabel: "Привязать почту",
    type: "email",
  },
} as const;

export function LinkedAccountForm({
  accountType,
  onSubmit,
}: LinkedAccountFormProps) {
  const [value, setValue] = useState("");
  const field = fields[accountType];

  useEffect(() => setValue(""), [accountType]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedValue = value.trim();
    if (normalizedValue) onSubmit(normalizedValue);
  };

  return (
    <form className="flex flex-col gap-3 pb-4" onSubmit={handleSubmit}>
      <AuthInput
        autoComplete={field.autoComplete}
        label={field.label}
        onChange={(event) => setValue(event.target.value)}
        placeholder={field.placeholder}
        type={field.type}
        value={value}
      />
      <AuthButton disabled={!value.trim()} type="submit">
        {field.submitLabel}
      </AuthButton>
    </form>
  );
}

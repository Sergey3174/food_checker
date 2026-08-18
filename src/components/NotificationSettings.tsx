import { BellRing, MessageCircleMore, Send } from "lucide-react";
import { useState } from "react";
import { ToggleSwitch } from "./ToggleSwitch";

const notificationChannels = [
  { id: "telegram", label: "Telegram", icon: Send },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircleMore },
  { id: "push", label: "Пуш-уведомления", icon: BellRing },
];

export function NotificationSettings() {
  const [enabledChannels, setEnabledChannels] = useState<Record<string, boolean>>({
    telegram: true,
    whatsapp: false,
    push: true,
  });

  return (
    <div className="border-t border-[var(--app-border)]/10 px-3.5 py-2">
      {notificationChannels.map(({ id, label, icon: Icon }) => {
        const isEnabled = enabledChannels[id];
        return (
          <div className="flex items-center gap-3 py-2" key={id}>
            <Icon className="text-[var(--app-text-subtle)]" size={16} />
            <span className="flex-1 text-[11px] text-[var(--app-text-muted)]">{label}</span>
            <ToggleSwitch
              checked={isEnabled}
              label={label}
              onCheckedChange={(isChecked) =>
                setEnabledChannels((channels) => ({
                  ...channels,
                  [id]: isChecked,
                }))
              }
            />
          </div>
        );
      })}
    </div>
  );
}

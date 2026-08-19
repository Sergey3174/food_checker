import { X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

const SHEET_ANIMATION_MS = 300;

type SettingsEditorSheetProps = {
  isOpen: boolean;
  title?: string;
  description?: string;
  children: ReactNode;
  onClose?: () => void;
  onSave?: () => void;
  disabled?: boolean;
  showSaveButtons?: boolean;
  showCloseButton?: boolean;
  showHeader?: boolean;
  overlayClassName?: string;
  sheetClassName?: string;
  sheetBaseClassName?: string;
};

export function SettingsEditorSheet({
  isOpen,
  title,
  description,
  children,
  onClose,
  onSave,
  disabled = false,
  showSaveButtons = true,
  showCloseButton = true,
  showHeader = true,
  overlayClassName = "",
  sheetClassName = "",
  sheetBaseClassName = "border border-[var(--app-border)]/20 bg-[var(--app-surface)] px-5 pb-8 pt-4 text-[var(--app-text)] shadow-2xl",
}: SettingsEditorSheetProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      return;
    }

    setIsVisible(false);

    const timeoutId = window.setTimeout(() => {
      setShouldRender(false);
    }, SHEET_ANIMATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!shouldRender) {
      setIsVisible(false);
      return;
    }

    if (!isOpen) {
      return;
    }

    let secondFrameId = 0;
    const firstFrameId = window.requestAnimationFrame(() => {
      secondFrameId = window.requestAnimationFrame(() => {
        setIsVisible(true);
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrameId);
      if (secondFrameId) {
        window.cancelAnimationFrame(secondFrameId);
      }
    };
  }, [isOpen, shouldRender]);

  useEffect(() => {
    if (!shouldRender) {
      return;
    }

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [shouldRender]);

  if (!shouldRender) {
    return null;
  }

  return createPortal(
    <div className="app-theme">
      <div
        className={`fixed inset-0 z-20 bg-[var(--app-page)]/80 transition-opacity duration-300 ${
          isVisible
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        } ${overlayClassName}`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-x-0 bottom-0 z-30 rounded-t-[24px] pb-[var(--sa-b)] transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "translate-y-full"
        } ${sheetBaseClassName} ${sheetClassName}`}
      >
        {showHeader && (
          <div className="mb-5 flex items-center leading-none justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-[var(--app-text)]">
                {title ?? "Редактировать"}
              </h3>
              {description && (
                <p className="mt-1 text-sm text-[var(--app-text-muted)]">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                aria-label="Close"
                className="rounded-xl border border-[var(--app-border)]/15 bg-[var(--app-surface-raised)] p-2 text-[var(--app-text-subtle)] transition-colors hover:text-[var(--app-text)]"
                onClick={onClose}
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        {children}

        {showSaveButtons && (
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              className="flex-1 rounded-xl border border-[var(--app-border)]/25 bg-[var(--app-surface-raised)] px-4 py-3 text-[13px] font-bold text-[var(--app-text-muted)] transition-colors hover:text-[var(--app-text)] disabled:opacity-40"
              onClick={onClose}
              disabled={disabled}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`flex-1 rounded-xl bg-[var(--app-success)] px-4 py-3 text-[13px] font-bold text-[var(--app-accent-text)] transition-colors hover:brightness-110 disabled:cursor-not-allowed ${disabled ? "opacity-40" : ""}`}
              onClick={onSave}
              disabled={disabled}
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
